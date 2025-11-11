import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, ChevronLeft, MapPin, Route, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const RIDE_STORAGE_KEY = "loopPlus:lastRide";

type RideDraft = {
  origin: string;
  destination: string;
  departure: string;
  seats: number;
};

const defaultRide: RideDraft = {
  origin: "",
  destination: "",
  departure: "",
  seats: 2,
};

const readStoredRide = (): RideDraft => {
  if (typeof window === "undefined") return defaultRide;

  try {
    const raw = window.localStorage.getItem(RIDE_STORAGE_KEY);
    if (!raw) return defaultRide;
    const parsed = JSON.parse(raw) as RideDraft;

    return {
      origin: parsed.origin ?? "",
      destination: parsed.destination ?? "",
      departure: parsed.departure ?? "",
      seats: parsed.seats && parsed.seats > 0 ? parsed.seats : defaultRide.seats,
    };
  } catch (error) {
    console.warn("[OfferRide] Failed to read stored ride", error);
    return defaultRide;
  }
};

const estimateSavings = (seats: number) => {
  const seatCount = Math.max(1, seats);
  const money = seatCount * 6.5; // €6.5 average per shared commute seat
  const co2 = seatCount * 4.2; // kg CO₂ avoided per additional passenger
  return {
    money,
    co2,
  };
};

const steps = [
  {
    id: 0,
    icon: MapPin,
    title: "Pickup Origin",
    subtitle: "Where will you start?",
    field: "origin" as const,
    placeholder: "e.g. Renault HQ, Paris",
    helper: "Pick a landmark or address commuters recognize.",
  },
  {
    id: 1,
    icon: Route,
    title: "Drop-off Destination",
    subtitle: "Where are you heading?",
    field: "destination" as const,
    placeholder: "e.g. Technocentre, Guyancourt",
    helper: "Let teammates know where the ride ends.",
  },
  {
    id: 2,
    icon: CalendarClock,
    title: "Departure & Seats",
    subtitle: "When are you leaving?",
    field: "details" as const,
    placeholder: "",
    helper: "Share timing and available spots.",
  },
];

export const OfferRide = () => {
  const [ride, setRide] = useState<RideDraft>(() => readStoredRide());
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [touchedSteps, setTouchedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(RIDE_STORAGE_KEY, JSON.stringify(ride));
  }, [ride]);

  useEffect(() => {
    setTouchedSteps((prev) => {
      if (prev.has(step)) return prev;
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  }, [step]);

  const progressValue = useMemo(() => ((step + (confirmed ? 1 : 0)) / steps.length) * 100, [step, confirmed]);

  const { money, co2 } = useMemo(() => estimateSavings(ride.seats), [ride.seats]);

  const updateRideField = <K extends keyof RideDraft>(key: K, value: RideDraft[K]) => {
    setRide((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const canAdvance =
    (step === 0 && ride.origin.trim().length > 2) ||
    (step === 1 && ride.destination.trim().length > 2) ||
    (step === 2 && ride.departure.trim().length > 0 && ride.seats > 0);

  const handleNext = () => {
    if (!canAdvance) return;

    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setConfirmed(true);
  };

  const handleBack = () => {
    if (confirmed) {
      setConfirmed(false);
      return;
    }
    setStep((current) => Math.max(0, current - 1));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleNext();
  };

  const resetRide = () => {
    setConfirmed(false);
    setStep(0);
  };

  const renderStepContent = () => {
    const current = steps[step];

    if (!current) return null;

    if (current.field === "origin") {
      return (
        <div className="space-y-3">
          <Label htmlFor="origin" className="text-sm font-semibold">
            Starting point
          </Label>
          <Input
            id="origin"
            value={ride.origin}
            autoFocus
            onChange={(event) => updateRideField("origin", event.target.value)}
            placeholder={current.placeholder}
          />
          <p className="text-xs text-muted-foreground">{current.helper}</p>
        </div>
      );
    }

    if (current.field === "destination") {
      return (
        <div className="space-y-3">
          <Label htmlFor="destination" className="text-sm font-semibold">
            Drop-off
          </Label>
          <Input
            id="destination"
            value={ride.destination}
            autoFocus
            onChange={(event) => updateRideField("destination", event.target.value)}
            placeholder={current.placeholder}
          />
          <p className="text-xs text-muted-foreground">{current.helper}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="departure" className="text-sm font-semibold">
            Departure time
          </Label>
          <Input
            id="departure"
            type="datetime-local"
            value={ride.departure}
            onChange={(event) => updateRideField("departure", event.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-muted-foreground">{current.helper}</p>
        </div>
        <div className="space-y-3">
          <Label htmlFor="seats" className="text-sm font-semibold">
            Seats available
          </Label>
          <Input
            id="seats"
            type="number"
            min={1}
            max={7}
            value={ride.seats}
            onChange={(event) => updateRideField("seats", Math.max(1, Number(event.target.value || 1)))}
          />
          <p className="text-xs text-muted-foreground">Let colleagues know how many spots they can reserve.</p>
        </div>
      </div>
    );
  };

  if (confirmed) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-24">
          <Button variant="ghost" className="mb-6" onClick={resetRide}>
            <ChevronLeft className="h-4 w-4" />
            Offer another ride
          </Button>
          <Card className="max-w-3xl mx-auto border-2 border-success/30 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <CardTitle className="text-3xl font-bold">Ride Created!</CardTitle>
              <CardDescription>
                Your commute from <span className="font-semibold text-foreground">{ride.origin}</span> to{" "}
                <span className="font-semibold text-foreground">{ride.destination}</span> is now live.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Departure</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {ride.departure
                    ? new Date(ride.departure).toLocaleString(undefined, {
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-primary/10 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-primary">Estimated Savings</p>
                <p className="mt-2 text-2xl font-semibold text-primary">
                  €{money.toFixed(1)}
                </p>
                <p className="text-xs text-primary/80">Per shared ride</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/10 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-secondary-foreground/80">CO₂ Avoided</p>
                <p className="mt-2 text-2xl font-semibold text-secondary-foreground">
                  {co2.toFixed(1)} kg
                </p>
                <p className="text-xs text-muted-foreground">Equivalent to {Math.round(co2 / 2.3)} metro trips</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Seats available: {ride.seats}</p>
                <p className="text-xs text-muted-foreground">We saved your route for next time.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={resetRide}>
                  Offer another ride
                </Button>
                <Button variant="hero">Share ride link</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    );
  }

  const currentStep = steps[step];

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            {step > 0 ? (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : null}
            <span className="uppercase tracking-wide text-xs">Offer a ride</span>
          </div>

          <Card className="border-2 shadow-lg">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <currentStep.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                  <CardDescription>{currentStep.subtitle}</CardDescription>
                </div>
              </div>
              <Progress value={progressValue} className="h-2" />
              <div className="flex gap-2 text-xs">
                {steps.map((stepConfig) => (
                  <span
                    key={stepConfig.id}
                    className={cn(
                      "flex-1 rounded-full border border-border/50 px-3 py-1 text-center transition-colors",
                      stepConfig.id === step
                        ? "bg-primary text-primary-foreground font-semibold"
                        : touchedSteps.has(stepConfig.id)
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/40 text-muted-foreground",
                    )}
                  >
                    Step {stepConfig.id + 1}
                  </span>
                ))}
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit} className="contents">
              <CardContent className="space-y-8">{renderStepContent()}</CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Shared rides cut parking demand and expenses for everyone.</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="ghost" disabled={step === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" disabled={!canAdvance} className="min-w-[140px]">
                    {step === steps.length - 1 ? "Publish ride" : "Next"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OfferRide;

