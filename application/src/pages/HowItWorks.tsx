import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  Brain,
  Target,
  TrendingUp,
  Download,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  BarChart3,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Resume",
      description:
        "Simply drag and drop your resume file or paste the text directly. We support PDF, DOC, and plain text formats.",
      features: [
        "PDF & DOC Support",
        "Text Paste Option",
        "Secure Upload",
        "Instant Processing",
      ],
      color: "from-blue-500 to-purple-600",
    },
    {
      number: "02",
      icon: FileText,
      title: "Add Job Description",
      description:
        "Copy and paste the job description you're targeting. Our AI will analyse every detail to find the best matches.",
      features: [
        "Full Text Analysis",
        "Keyword Detection",
        "Skills Extraction",
        "Requirements Mapping",
      ],
      color: "from-green-500 to-emerald-600",
    },
    {
      number: "03",
      icon: Brain,
      title: "AI Analysis",
      description:
        "Our advanced AI algorithms compare your resume against the job requirements in seconds, not hours.",
      features: [
        "Machine Learning",
        "Natural Language Processing",
        "Pattern Recognition",
        "Semantic Analysis",
      ],
      color: "from-purple-500 to-pink-600",
    },
    {
      number: "04",
      icon: BarChart3,
      title: "Get Detailed Results",
      description:
        "Receive comprehensive insights including match scores, missing keywords, and actionable improvement suggestions.",
      features: [
        "Match Percentage",
        "Keyword Analysis",
        "Improvement Tips",
        "ATS Optimisation",
      ],
      color: "from-orange-500 to-red-600",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get results in under 30 seconds",
      stat: "< 30sec",
    },
    {
      icon: Target,
      title: "Highly Accurate",
      description: "AI-powered precision matching",
      stat: "95%",
    },
    {
      icon: Shield,
      title: "Completely Secure",
      description: "Your data is encrypted and protected",
      stat: "100%",
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Analyse resumes anytime, anywhere",
      stat: "24/7",
    },
  ];

  const faqs = [
    {
      question: "How accurate is the AI analysis?",
      answer:
        "Our AI has been trained on thousands of job descriptions and resumes, achieving 95% accuracy in matching relevant skills and keywords.",
    },
    {
      question: "Is my resume data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption and never store your personal documents. All analysis is done in real-time and data is immediately discarded.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "We support PDF, DOC, DOCX files, as well as plain text input. Our system can extract text from most common resume formats.",
    },
    {
      question: "Can I analyse multiple job descriptions?",
      answer:
        "Yes! You can analyse your resume against as many job descriptions as you want to find the best matches and optimisation opportunities.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Perfect Your Resume in</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Our AI-powered platform makes resume optimisation effortless. Get
            detailed insights, match scores, and actionable recommendations in
            minutes.
          </p>
          <Button asChild variant="hero" size="xl" className="group">
            <Link to="/analyze">
              Try It Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Step-by-Step Process
            </h2>
            <p className="text-xl text-muted-foreground">
              From upload to optimisation in just a few clicks
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-muted-foreground/20">
                      {step.number}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      {step.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <Card className="bg-gradient-to-br from-card to-muted/50 border-0 shadow-xl">
                    <CardContent className="p-8">
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
                        <step.icon
                          className={`h-16 w-16 mx-auto mb-4 text-transparent bg-gradient-to-r ${step.color} bg-clip-text`}
                          style={{
                            filter:
                              "drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))",
                          }}
                        />
                        <h4 className="text-lg font-semibold mb-2">
                          {step.title} Demo
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Interactive preview coming soon
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for speed, accuracy, and your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-full w-fit mx-auto">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {benefit.stat}
                  </div>
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Perfect Your Resume?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of job seekers who have improved their match rates
              with our AI platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="xl" className="group">
                <Link to="/analyze">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
