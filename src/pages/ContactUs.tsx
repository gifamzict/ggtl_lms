import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Users } from "lucide-react";
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
      console.log("Contact form submission:", formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      
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
      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary py-24 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <span>HOME</span>
              <span>•</span>
              <span>CONTACT US</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-gray-800">Office Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  7 Yaya Abatan Rd, Aguda Lagos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-pink-600" />
                </div>
                <CardTitle className="text-gray-800">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  info@ggtl.tech<br />
                  support@ggtl.tech
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-gray-800">Let's Discuss</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Phone: +234 707 507 4103<br />
                  Phone: +234 813 3554 5833
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-gray-800">Team Up with Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Lagos Nigeria<br />
                  Lagos Nigeria
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Professional Image */}
            <div className="lg:order-1">
              <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Users className="h-16 w-16 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Professional Support</h3>
                    <p className="text-gray-600">Ready to help you succeed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Send Us Message</h2>
                <p className="text-gray-600 mb-6">
                  Your email address will not be published. Required fields are marked *
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Name*"
                        className="bg-gray-50 border-gray-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email*"
                        className="bg-gray-50 border-gray-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject*"
                      className="bg-gray-50 border-gray-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message*"
                      rows={6}
                      className="bg-gray-50 border-gray-200"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Now'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.4147072877!2d3.3516334!3d6.5448185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d58e2f2a827%3A0x24e30869c5ae8c79!2sYaya%20Abatan%20Rd%2C%20Ogba%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1709234567890!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GGTL Office Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}