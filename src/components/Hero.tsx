import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Leaf, Shield } from "lucide-react";
import heroImage from "@/assets/hero-carpooling.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Leaf className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">
                Trusted Shared Mobility
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Commute Better,{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Together.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Connect with trusted colleagues for safe, affordable, and eco-friendly carpooling — all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group" asChild>
                <Link to="/rides">
                  Get Started →
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold">1,200+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-3xl font-bold">45T</p>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-sm text-muted-foreground">Trust Score</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <img
              src={heroImage}
              alt="Happy colleagues carpooling together"
              className="relative rounded-3xl shadow-card w-full object-cover aspect-video"
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
    </section>
  );
};
