import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SteeringWheel } from "lucide-react";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
  const navigate = useNavigate();
  const { hasOnboarded, loading, completeOnboarding } = useUser();
  const [screen, setScreen] = useState<"welcome" | "choice">("welcome");
  const [signInOpen, setSignInOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedName = window.localStorage.getItem("loopPlus:lastDisplayName");
    if (storedName) setDisplayName(storedName);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!displayName) return;
    window.localStorage.setItem("loopPlus:lastDisplayName", displayName);
  }, [displayName]);

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
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

  const proceedToChoice = () => {
    setScreen("choice");
  };

  const handleSignInOpen = () => setSignInOpen(true);
  const handleSignInClose = () => setSignInOpen(false);

  const handleSignInSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your company email or continue as guest.");
      return;
    }
    const nameFromEmail = trimmed.split("@")[0]?.replace(/\W+/g, " ") || "Guest";
    completeOnboarding({
      displayName: nameFromEmail,
      company: "Company email",
      isGuest: false,
    });
    setSignInOpen(false);
    setScreen("choice");
  };

  const goDiscover = () => {
    completeOnboarding({
      displayName: displayName || "Guest",
      company: company ? companyLabelByValue[company] : undefined,
      isGuest: !company || company === "guest",
    });
    navigate("/rides", { replace: false });
  };

  const goOffer = () => {
    completeOnboarding({
      displayName: displayName || "Guest",
      company: company ? companyLabelByValue[company] : undefined,
      isGuest: !company || company === "guest",
    });
    navigate("/offer", { replace: false });
  };

  const ivoryBg = "from-[#FFF8E6] via-background to-[#FFF8E6]";

  if (loading || hasOnboarded) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br", ivoryBg)} />

      {/* Screen container with fade between screens */}
      <div className="relative w-full max-w-3xl">
        {/* Screen 1 — Welcome / Sign-In Light */}
        <div className={cn("transition-opacity duration-300", screen === "welcome" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0")}>
          <Card className="border-border/60 shadow-2xl">
            <CardHeader className="space-y-3 text-center">
              <CardTitle className="text-2xl sm:text-3xl">Welcome to Loop+ by Renault</CardTitle>
              <CardDescription className="text-base">
                Find or share rides with trusted coworkers — no account setup needed for now.
              </CardDescription>
              <div className="mx-auto w-fit rounded-lg border border-dashed border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Verification will be added later for corporate pilots.
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleProfileSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name (optional)</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="e.g. Sofia, Operations Lead"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Organization (optional)</Label>
                  <Select value={company} onValueChange={(nextCompany) => setCompany(nextCompany)}>
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Start without a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANIES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button type="button" size="lg" className="w-full sm:w-auto" onClick={proceedToChoice}>
                Continue as Guest
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleSignInOpen}>
                Sign in with Company Email (optional)
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Screen 2 — Choose How to Start */}
        <div className={cn("transition-opacity duration-300", screen === "choice" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0")}>
          <Card className="border-border/60 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setScreen("welcome")} className="gap-2">
                  ← Back
                </Button>
                <span className="text-xs text-muted-foreground">Step 1 of 3</span>
              </div>
              <div className="text-center mt-2 space-y-2">
                <CardTitle className="text-2xl sm:text-3xl">How would you like to commute today?</CardTitle>
                <CardDescription>Let’s find your match or share your route.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={goDiscover}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 border-border/60 bg-background/80 p-6 text-left shadow-lg transition-all",
                    "hover:-translate-y-1 hover:shadow-xl hover:border-amber-300 hover:ring-2 hover:ring-amber-300/50",
                  )}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Discover a Ride</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Join a colleague who’s already driving your way.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={goOffer}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 border-border/60 bg-background/80 p-6 text-left shadow-lg transition-all",
                    "hover:-translate-y-1 hover:shadow-xl hover:border-amber-300 hover:ring-2 hover:ring-amber-300/50",
                  )}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <SteeringWheel className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Offer a Ride</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Share your route and let others join you.</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optional Sign-in Modal */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in with Company Email</DialogTitle>
            <DialogDescription>Optional — you can skip this and continue as a guest.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Company email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={handleSignInClose}>
                Skip
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

