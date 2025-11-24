import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, SteeringWheel } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";

export const ChooseMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E6] via-background to-[#FFF8E6]">
      <Navigation />
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-6" onClick={() => navigate("/signup")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                How would you like to commute today?
              </h1>
              <p className="text-xl text-muted-foreground">
                Let's find your match or share your route.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Discover a Ride Card */}
              <Card
                className={cn(
                  "border-2 border-border/60 cursor-pointer group shadow-lg transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-xl hover:border-amber-300 hover:ring-2 hover:ring-amber-300/50"
                )}
                onClick={() => navigate("/rides")}
              >
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <Search className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl">Discover a Ride</CardTitle>
                  <CardDescription className="text-base">
                    Join a colleague who's already driving your way.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="hero" className="w-full group-hover:scale-105 transition-transform">
                    Browse Available Rides
                    <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </CardContent>
              </Card>

              {/* Offer a Ride Card */}
              <Card
                className={cn(
                  "border-2 border-border/60 cursor-pointer group shadow-lg transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-xl hover:border-amber-300 hover:ring-2 hover:ring-amber-300/50"
                )}
                onClick={() => navigate("/offer")}
              >
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <SteeringWheel className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl">Offer a Ride</CardTitle>
                  <CardDescription className="text-base">
                    Share your route and let others join you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="hero" className="w-full group-hover:scale-105 transition-transform">
                    Create Your Ride
                    <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

