import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { useUser } from "@/context/UserContext";
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

export const SignUp = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState<string>();
  const [companyEmail, setCompanyEmail] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedName = window.localStorage.getItem("loopPlus:lastDisplayName");
    if (storedName) {
      setFirstName(storedName);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (useEmail && !companyEmail.trim()) {
      setError("Please enter your company email or continue as guest.");
      return;
    }

    const trimmedName = firstName.trim() || "Guest";
    const isGuest = !useEmail || !company || company === "guest";

    completeOnboarding({
      displayName: trimmedName,
      company: isGuest ? undefined : companyLabelByValue[company],
      isGuest,
    });

    navigate("/choose-mode");
  };

  const handleGuest = () => {
    completeOnboarding({
      displayName: "Guest",
      company: undefined,
      isGuest: true,
    });
    navigate("/choose-mode");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Landing
        </Button>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl">Welcome to Loop+ by Renault</CardTitle>
            <CardDescription>
              Find or share rides with trusted coworkers — no account setup needed for now.
            </CardDescription>
            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
              Verification will be added later for corporate pilots.
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit} className="contents">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="e.g. Sofia"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-email">Company Email (Optional)</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={companyEmail}
                  onChange={(event) => {
                    setCompanyEmail(event.target.value);
                    setUseEmail(event.target.value.length > 0);
                  }}
                  placeholder="name@company.com"
                />
                <p className="text-xs text-muted-foreground">
                  Skip this to continue as a guest.
                </p>
              </div>

              {useEmail && (
                <div className="space-y-2">
                  <Label htmlFor="company">Organization</Label>
                  <Select
                    value={company}
                    onValueChange={(nextCompany) => {
                      setCompany(nextCompany);
                    }}
                  >
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select your organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANIES.filter((c) => c.value !== "guest").map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3">
              <Button type="submit" size="lg" className="w-full">
                Continue
              </Button>
              <Button type="button" variant="ghost" onClick={handleGuest} className="w-full">
                Continue as Guest
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
};

