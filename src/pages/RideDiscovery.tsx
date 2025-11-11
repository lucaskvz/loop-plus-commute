import { useMemo, useState } from "react";
import { Flame, MapPin, Navigation, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useChat } from "@/context/ChatContext";
import { ACTIVE_RIDES, type Ride } from "@/data/rides";

type Filter = "all" | "same-company" | "women" | "earliest";

const filterButtons: { id: Filter; label: string }[] = [
  { id: "all", label: "All rides" },
  { id: "same-company", label: "Same company" },
  { id: "women", label: "Women drivers" },
  { id: "earliest", label: "Earliest ride" },
];

const friendlyDeparture = (departure: string) =>
  new Date(departure).toLocaleString(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const RideDiscovery = () => {
  const { profile } = useUser();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [joinedRideIds, setJoinedRideIds] = useState<Set<string>>(new Set());
  const { openThreadForRide } = useChat();

  const filteredRides = useMemo(() => {
    let rides = [...ACTIVE_RIDES];

    rides.sort((a, b) => {
      if (a.distanceFromYouKm === b.distanceFromYouKm) {
        return new Date(a.departure).getTime() - new Date(b.departure).getTime();
      }
      return a.distanceFromYouKm - b.distanceFromYouKm;
    });

    if (filter === "same-company" && profile?.company) {
      rides = rides.filter((ride) => ride.driverCompany === profile.company);
    } else if (filter === "women") {
      rides = rides.filter((ride) => ride.driverGender === "female");
    } else if (filter === "earliest") {
      rides.sort((a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime());
    }

    return rides;
  }, [filter, profile?.company]);

  const handleJoin = (ride: Ride) => {
    setJoinedRideIds((prev) => {
      const next = new Set(prev);
      next.add(ride.id);
      return next;
    });
    toast({
      title: "Ride joined!",
      description: `We shared your profile with ${ride.driverName}. Check your dashboard for the next steps.`,
    });
    openThreadForRide(
      {
        rideId: ride.id,
        origin: ride.origin,
        destination: ride.destination,
        departure: ride.departure,
        driverName: ride.driverName,
        partnerName: ride.driverName,
        role: "passenger",
      },
      { initialMessage: "Welcome aboard! Feel free to sync final details here." },
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-24">
        <header className="mb-10 flex flex-col gap-6 text-center sm:text-left sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Search className="h-3.5 w-3.5" />
              Ride Discovery
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Find a ride near you</h1>
            <p className="text-muted-foreground text-base">
              Sorted by who&apos;s closest and leaving soon. Join in one tap — we&apos;ll handle the rest.
            </p>
          </div>
          <div className="flex w-full sm:w-auto flex-wrap justify-center gap-2">
            {filterButtons.map((button) => (
              <Button
                key={button.id}
                variant={filter === button.id ? "hero" : "outline"}
                size="sm"
                onClick={() => setFilter(button.id)}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRides.map((ride) => {
            const joined = joinedRideIds.has(ride.id);
            return (
              <Card
                key={ride.id}
                className={cn(
                  "relative overflow-hidden border-2 bg-background/80 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl",
                  joined ? "border-success/60" : "border-border/60",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary" />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {ride.driverName}
                        {ride.driverGender === "female" ? (
                          <Badge variant="secondary" className="uppercase">
                            Women driver
                          </Badge>
                        ) : null}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {ride.driverCompany ?? "Independent"} • {ride.seatsLeft} seats left
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Navigation className="h-3 w-3" />
                      {ride.distanceFromYouKm.toFixed(1)} km
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 rounded-xl border border-border/40 bg-muted/30 p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{ride.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-6 text-xs uppercase tracking-wide text-muted-foreground">
                      <Flame className="h-3.5 w-3.5" />
                      {friendlyDeparture(ride.departure)}
                    </div>
                    <div className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-secondary" />
                      {ride.destination}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Users className="mr-1 h-3 w-3" />
                      {ride.seatsLeft} seats
                    </Badge>
                    {ride.tags?.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={joined ? "success" : "hero"}
                    className="w-full"
                    disabled={joined}
                    onClick={() => handleJoin(ride)}
                  >
                    {joined ? "Request sent" : "Join ride"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredRides.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-12 text-center">
            <p className="text-lg font-medium text-foreground">No rides match your filters yet</p>
            <p className="text-sm text-muted-foreground">Try broadening your filters or checking again in a few minutes.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default RideDiscovery;

