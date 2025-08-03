import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  Phone,
  HelpCircle,
  Zap,
  CheckCircle,
  Heart,
  Star,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@resumeanalyser.com",
      description: "Send us an email anytime",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      value: "Available 24/7",
      description: "Chat with our support team",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "< 24 hours",
      description: "Average response time",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const faqs = [
    {
      question: "How can I get technical support?",
      answer:
        "You can reach our technical support team via email, live chat, or by filling out the contact form. We typically respond within 24 hours.",
    },
    {
      question: "Do you offer phone support?",
      answer:
        "Yes! Phone support is available Monday through Friday, 9AM-6PM EST. For urgent issues, email support is available 24/7.",
    },
    {
      question: "Can I request new features?",
      answer:
        "Absolutely! We love hearing from our users. Send us your feature requests and feedback through any of our contact channels.",
    },
    {
      question: "Is there a help documentation?",
      answer:
        "Yes, we have comprehensive documentation and tutorials available. You can also check our How It Works page for detailed guides.",
    },
  ];

  const supportTypes = [
    {
      icon: HelpCircle,
      title: "General Questions",
      description: "Get help with using our platform",
    },
    {
      icon: Zap,
      title: "Technical Issues",
      description: "Report bugs or technical problems",
    },
    {
      icon: Star,
      title: "Feature Requests",
      description: "Suggest new features or improvements",
    },
    {
      icon: Heart,
      title: "Feedback",
      description: "Share your experience and suggestions",
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
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Get in Touch</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              We're Here to Help
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Have questions about our platform? Need technical support? Want to
            share feedback? We'd love to hear from you and are here to help you
            succeed.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Send us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What can we help you with?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your question or feedback..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="hero"
                      size="lg"
                      className="w-full group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Prefer to reach out directly? Here are all the ways you can
                  contact us.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${info.color} shadow-lg`}
                        >
                          <info.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {info.title}
                          </h3>
                          <p className="text-lg font-medium text-primary mb-1">
                            {info.value}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Support Types */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    What can we help you with?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {supportTypes.map((type, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                      >
                        <type.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{type.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
              Quick answers to common questions about our support
            </p>
          </div>

          <div className="grid gap-6">
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

      {/* Office Hours Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Support Hours</h2>
              <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Email & Live Chat
                  </h3>
                  <p className="text-muted-foreground">Available 24/7</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                  <p className="text-muted-foreground">Monday - Friday</p>
                  <p className="text-muted-foreground">9:00 AM - 6:00 PM EST</p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Average response time: Under 4 hours during business hours
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
