import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return false;
    }
    
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For now, we'll simulate the API call
      // TODO: Replace with actual API endpoint
      console.log("Contact form submission:", formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: ""
      });
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about our courses? Need guidance on your tech journey? 
            We're here to help. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Ready to transform your career with technology? Our team is here to guide you 
                  through your learning journey and answer any questions you may have about our 
                  courses, programs, or career opportunities.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Office Address</h3>
                        <p className="text-muted-foreground">
                          123 Technology Drive<br />
                          Victoria Island, Lagos<br />
                          Nigeria
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Phone Number</h3>
                        <p className="text-muted-foreground">
                          +234 (0) 901 234 5678
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Email Address</h3>
                        <p className="text-muted-foreground">
                          contact@ggtl.tech
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our programs and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  How long are the courses?
                </h3>
                <p className="text-muted-foreground">
                  Our courses range from 8-16 weeks depending on the program. 
                  All courses are designed to be completed while working full-time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Do you offer job placement assistance?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We provide career support including resume building, 
                  interview preparation, and connections to our employer network.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Are there payment plans available?
                </h3>
                <p className="text-muted-foreground">
                  We offer flexible payment options including installment plans 
                  to make our courses accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Can I study part-time?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely! Our courses are designed for working professionals 
                  with flexible schedules and self-paced learning options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}