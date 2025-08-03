import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileSearch,
  TrendingUp,
  Download,
  Zap,
  Shield,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms analyse your resume against job requirements with precision.",
      badge: "Core Feature",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Match Score",
      description:
        "Get an instant percentage match score showing how well your resume aligns with the job description.",
      badge: "Instant",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: FileSearch,
      title: "Keyword Analysis",
      description:
        "Identify missing keywords and phrases that could improve your resume's visibility to ATS systems.",
      badge: "ATS Optimised",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: TrendingUp,
      title: "Improvement Suggestions",
      description:
        "Receive detailed recommendations on how to enhance your resume for better job matching.",
      badge: "Actionable",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Download,
      title: "Export Results",
      description:
        "Download your analysis results as a PDF report to track improvements over time.",
      badge: "PDF Export",
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Get comprehensive analysis results in seconds, not hours. Perfect for busy job seekers.",
      badge: "Fast",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Resumes Analysed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "30%", label: "Match Improvement" },
    { number: "24/7", label: "Available" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Powerful Features for
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">
              Resume Success
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform provides everything you need to optimise
            your resume and increase your chances of landing your dream job.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Trusted by Professionals
            </h3>
            <p className="text-muted-foreground">
              Join thousands of job seekers who have improved their resume match
              rates
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process preview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Simple 3-Step Process
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
            {[
              { step: "1", title: "Upload Resume", icon: FileSearch },
              { step: "2", title: "Add Job Description", icon: Target },
              { step: "3", title: "Get AI Analysis", icon: CheckCircle },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
