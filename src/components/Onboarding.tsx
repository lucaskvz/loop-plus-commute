import { FormEvent, useEffect, useState } from "react";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COMPANIES = [
  { value: "guest", label: "Explore as Guest" },
  { value: "loop-hq", label: "Loop HQ" },
  { value: "renault-fleet", label: "Renault Fleet Partners" },
  { value: "urban-co", label: "Urban Co-Labs" },
  { value: "campus-commute", label: "Campus Commute Alliance" },
];

const companyLabelByValue = COMPANIES.reduce<Record<string, string>>((acc, company) => {
  acc[company.value] = company.label;
  return acc;
}, {});

export const Onboarding = () => {
  const { hasOnboarded, loading, completeOnboarding } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (displayName) return;

    const storedName = window.localStorage.getItem("loopPlus:lastDisplayName");
    if (storedName) {
      setDisplayName(storedName);
    }
  }, [displayName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!displayName) return;
    window.localStorage.setItem("loopPlus:lastDisplayName", displayName);
  }, [displayName]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setError("Add a display name or continue as guest.");
      return;
    }

    const isGuest = !company || company === "guest";
    completeOnboarding({
      displayName: trimmedName || "Guest",
      company: isGuest ? undefined : companyLabelByValue[company],
      isGuest,
    });
  };

  const handleGuest = () => {
    completeOnboarding({
      displayName: "Guest",
      company: undefined,
      isGuest: true,
    });
  };

  if (loading || hasOnboarded) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      <Card className="w-full max-w-md border-border/60 shadow-2xl">
        <CardHeader className="space-y-4">
          <CardTitle>Welcome to Loop+</CardTitle>
          <CardDescription>
            Set a quick display name and optionally choose your organization. You can start exploring right away.
          </CardDescription>
          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
            Verification will be added later for corporate pilots.
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit} className="contents">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="e.g. Sofia, Operations Lead"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Organization (optional)</Label>
              <Select
                value={company}
                onValueChange={(nextCompany) => {
                  setCompany(nextCompany);
                }}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Start without linking a company" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose your fleet or campus. Skip to explore as a guest.
              </p>
            </div>

            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3">
            <Button type="submit" size="lg" className={cn("w-full")}>
              Save and start exploring
            </Button>
            <Button type="button" variant="ghost" onClick={handleGuest} className="w-full">
              Continue as guest
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

