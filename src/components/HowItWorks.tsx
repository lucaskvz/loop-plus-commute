import { Badge } from "@/components/ui/badge";
import { CheckCircle2, UserCheck, Search, MessageCircle, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Sign Up & Verify",
    description: "Create your account with your corporate email. One-time verification keeps everyone safe.",
    step: "01"
  },
  {
    icon: Search,
    title: "Find Your Match",
    description: "Search for rides or offer your own. Our smart algorithm suggests the best matches for your route.",
    step: "02"
  },
  {
    icon: MessageCircle,
    title: "Connect & Coordinate",
    description: "Message your ride partners to finalize pickup details. Simple, fast, secure.",
    step: "03"
  },
  {
    icon: TrendingUp,
    title: "Track & Earn",
    description: "See your impact grow with every ride. Earn points, unlock rewards, and celebrate your contribution.",
    step: "04"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Simple Process
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Start Carpooling in{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              4 Easy Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From sign-up to your first shared ride in minutes.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-20"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step number indicator */}
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-hero border-2 border-primary/20 flex items-center justify-center shadow-card">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-primary">
                        {step.step}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Checkmark for completed look */}
                  {index < steps.length - 1 && (
                    <CheckCircle2 className="hidden lg:block absolute -right-4 top-8 w-6 h-6 text-success opacity-50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
