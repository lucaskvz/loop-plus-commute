import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-2 shadow-card overflow-hidden">
          <CardContent className="p-12 relative">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Join the Movement</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to Transform Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Daily Commute?
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of professionals who are saving money, reducing emissions, 
                and building meaningful connections on their way to work.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="hero" size="lg" className="group" asChild>
                  <Link to="/offer">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Demo
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground pt-4">
                🔒 Your organization email required • Free to start • No credit card needed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
