import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, TrendingDown, Award, MessageSquare, CalendarClock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Members Only",
    description: "Corporate email verification ensures you only ride with trusted colleagues from your organization.",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Smart Matching",
    description: "Find perfect ride partners based on your route, schedule, and preferences in seconds.",
    color: "text-primary"
  },
  {
    icon: TrendingDown,
    title: "Track Your Impact",
    description: "See real-time savings in money and CO₂ emissions. Make every commute count.",
    color: "text-secondary"
  },
  {
    icon: Award,
    title: "Earn Rewards",
    description: "Get points for every shared ride and redeem them for exclusive company perks.",
    color: "text-primary"
  },
  {
    icon: MessageSquare,
    title: "Seamless Communication",
    description: "Coordinate pickup details with quick messages and one-tap status updates.",
    color: "text-accent"
  },
  {
    icon: CalendarClock,
    title: "Flexible Scheduling",
    description: "Create one-time or recurring rides that fit your daily routine perfectly.",
    color: "text-secondary"
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Safe Carpooling
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Built for modern organizations that care about their people and the planet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-2"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
