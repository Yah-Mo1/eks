import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const features = [
    { icon: Zap, text: "AI-Powered Analysis" },
    { icon: Target, text: "Match Score & Insights" },
    { icon: CheckCircle, text: "Instant Results" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Perfect Your</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Resume Match
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Get instant AI-powered analysis of how well your resume matches
                any job description. Discover missing keywords, improvement
                suggestions, and boost your hiring chances.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-muted-foreground"
                >
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild variant="hero" size="xl" className="group">
                <Link to="/analyze">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-muted-foreground mb-2">
                Trusted by job seekers worldwide
              </p>
              <div className="flex justify-center lg:justify-start items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  10,000+ resumes analysed
                </span>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="AI Resume Analysis Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                95% Match!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs font-medium">AI Analysing...</span>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -inset-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
