import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Car } from "lucide-react";

export const Navigation = () => {
  const { profile, resetOnboarding, loading } = useUser();

  const initials =
    profile?.displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "LP";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-primary/10 text-primary text-xs font-semibold tracking-wide">
        <div className="container mx-auto flex items-center justify-center px-4 py-2 text-center">
          Verification will be added later for corporate pilots.
        </div>
      </div>
      <nav className="bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  Loop<span className="text-primary">+</span>
                </h1>
                <p className="text-xs text-muted-foreground leading-none">by Renault</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
            </div>

            {/* User identity */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium leading-tight">
                  {profile?.displayName ?? "Guest"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile?.company ?? "Guest access"}
                </span>
              </div>
              <Avatar className="h-9 w-9 border border-border/70 bg-muted/70">
                <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={resetOnboarding} disabled={loading}>
                Switch profile
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
