import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ACTIVE_RIDES, type Ride } from "@/data/rides";
import { useUser } from "@/context/UserContext";

type RideDraft = {
  origin: string;
  destination: string;
  departure: string;
  seats: number;
};

type MatchSuggestion = {
  ride: Ride;
  overlapMinutes: number;
};

const RIDE_STORAGE_KEY = "loopPlus:lastRide";
const DISMISSED_KEY = "loopPlus:dismissedSuggestions";
const JOINED_KEY = "loopPlus:joinedSuggestions";

const isTimeOverlap = (a: string, b: string, deltaMinutes = 30) => {
  if (!a || !b) return false;
  const timeA = new Date(a).getTime();
  const timeB = new Date(b).getTime();
  return Math.abs(timeA - timeB) <= deltaMinutes * 60 * 1000;
};

const areRoutesSimilar = (a: string, b: string) => {
  if (!a || !b) return false;
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  const wordsA = normalize(a);
  const wordsB = new Set(normalize(b));
  return wordsA.some((word) => wordsB.has(word));
};

const readRideDraft = (): RideDraft | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RIDE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RideDraft;
    if (!parsed?.origin || !parsed?.destination || !parsed?.departure) return null;
    return parsed;
  } catch {
    return null;
  }
};

const readSetFromStorage = (key: string) => {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set<string>();
  }
};

const writeSetToStorage = (key: string, value: Set<string>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(Array.from(value)));
};

const findBestMatch = (
  rideDraft: RideDraft,
  profileCompany: string | null | undefined,
  dismissed: Set<string>,
  joined: Set<string>,
): MatchSuggestion | null => {
  const candidates = ACTIVE_RIDES.filter((ride) => {
    if (dismissed.has(ride.id) || joined.has(ride.id)) return false;
    const routeMatches =
      areRoutesSimilar(ride.origin, rideDraft.origin) && areRoutesSimilar(ride.destination, rideDraft.destination);
    const timeMatches = isTimeOverlap(ride.departure, rideDraft.departure);
    const companyBoost = profileCompany && ride.driverCompany === profileCompany;
    return routeMatches && timeMatches && (companyBoost || ride.seatsLeft > 0);
  });

  if (candidates.length === 0) {
    return null;
  }

  const best = candidates
    .map((ride) => ({
      ride,
      overlapMinutes: Math.abs(new Date(ride.departure).getTime() - new Date(rideDraft.departure).getTime()) / 60000,
    }))
    .sort((a, b) => a.overlapMinutes - b.overlapMinutes)[0];

  return best;
};

export const SmartSuggestion = () => {
  const { profile } = useUser();
  const { toast } = useToast();
  const [rideDraft, setRideDraft] = useState<RideDraft | null>(() => readRideDraft());
  const [dismissed, setDismissed] = useState<Set<string>>(() => readSetFromStorage(DISMISSED_KEY));
  const [joined, setJoined] = useState<Set<string>>(() => readSetFromStorage(JOINED_KEY));

  useEffect(() => {
    const handleStorage = () => {
      setRideDraft(readRideDraft());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const suggestion = useMemo(() => {
    if (!rideDraft) return null;
    return findBestMatch(rideDraft, profile?.company, dismissed, joined);
  }, [rideDraft, profile?.company, dismissed, joined]);

  const handleDismiss = () => {
    if (!suggestion) return;
    const next = new Set(dismissed);
    next.add(suggestion.ride.id);
    setDismissed(next);
    writeSetToStorage(DISMISSED_KEY, next);
  };

  const handleAccept = () => {
    if (!suggestion) return;

    const nextJoined = new Set(joined);
    nextJoined.add(suggestion.ride.id);
    setJoined(nextJoined);
    writeSetToStorage(JOINED_KEY, nextJoined);

    toast({
      title: "Shared ride room created",
      description: `We matched you with ${suggestion.ride.driverName}. Check your rides inbox to confirm details.`,
    });
  };

  if (!suggestion) {
    return null;
  }

  const { ride } = suggestion;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-4">
      <Card className="border-primary/50 shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Smart match 🚗</CardTitle>
          <CardDescription>
            You and {ride.driverName.split(" ")[0]} are heading to {ride.destination} around{" "}
            {new Date(ride.departure).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            {ride.seatsLeft} seats open • {ride.distanceFromYouKm.toFixed(1)} km away
          </p>
          {profile?.company && ride.driverCompany === profile.company ? (
            <p className="text-primary font-medium">Same organization match</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDismiss} className="flex-1">
            Skip
          </Button>
          <Button variant="hero" size="sm" onClick={handleAccept} className="flex-1">
            Share ride
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

