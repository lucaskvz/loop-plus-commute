import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Car } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";

export const ChooseMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/signup")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              How would you like to commute today?
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your path to start sharing rides
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Discover a Ride Card */}
            <Card
              className="border-2 hover:border-primary/50 transition-all cursor-pointer group shadow-lg hover:shadow-xl"
              onClick={() => navigate("/rides")}
            >
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Discover a Ride</CardTitle>
                <CardDescription className="text-base">
                  Find colleagues already driving your way
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
              className="border-2 hover:border-primary/50 transition-all cursor-pointer group shadow-lg hover:shadow-xl"
              onClick={() => navigate("/offer")}
            >
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Car className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Offer a Ride</CardTitle>
                <CardDescription className="text-base">
                  Share your route and let others join
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
      </main>
    </div>
  );
};

