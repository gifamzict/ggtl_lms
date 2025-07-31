import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, BookOpen, Globe, TrendingUp, Shield, Zap, Clock, CheckCircle, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import aboutHero from "@/assets/about-hero.jpg";
import studentSuccessAbout from "@/assets/student-success-about.jpg";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section 
        className="relative py-32 bg-cover bg-center text-white overflow-hidden"
        style={{ backgroundImage: `url(${aboutHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-2 text-white/90 mb-4">
              <span>HOME</span>
              <span>•</span>
              <span>ABOUT US</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">ABOUT US</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Empowering the next generation of tech professionals across Africa through 
              world-class education and practical skills development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Study & Develop Section - Based on Screenshot */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img 
                  src={studentSuccessAbout} 
                  alt="GGTL Students Learning" 
                  className="rounded-lg shadow-lg w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">20K+</div>
                    <div className="text-sm text-gray-600">ENROLLED LEARNERS</div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3 backdrop-blur-sm">
                  <Play className="h-8 w-8 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium">Learn More About Us</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Study & Develop Your Skills
                <br />
                <span className="text-primary">Regardless of Location.</span>
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Gifana ICT Technology is an online learning platform where students learn tech from scratch 
                  through real-time, hands-on projects. Whether you're a beginner eager to learn or someone 
                  ready to teach, this is your home.
                </p>
                <p>
                  We help you grow from zero to project-ready—and even become an instructor. If you're 
                  passionate about tech but unsure where to start, we're the right place for you.
                </p>
              </div>
              
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium">
                Start Free Trial
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-gray-400">Students Graduated</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-400">Expert Instructors</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-gray-400">Courses Available</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border h-full">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Target className="h-8 w-8 text-primary mr-3" />
                    <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to high-quality technology education across Africa, 
                    bridging the digital skills gap and creating pathways for economic empowerment 
                    through innovative learning experiences that prepare students for the global 
                    tech economy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border h-full">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Globe className="h-8 w-8 text-primary mr-3" />
                    <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To become Africa's leading technology education platform, recognized globally 
                    for producing skilled, innovative, and industry-ready tech professionals who 
                    drive digital transformation across the continent and beyond.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose GGTL Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose GGTL Tech?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We offer more than just courses – we provide a complete learning ecosystem 
                designed for your success in the tech industry.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-12 w-12 text-primary mb-4" />,
                title: "Expert Instructors",
                description: "Learn from industry professionals with years of real-world experience in top tech companies and successful startups."
              },
              {
                icon: <BookOpen className="h-12 w-12 text-primary mb-4" />,
                title: "Practical Skills",
                description: "Hands-on projects and real-world applications ensure you graduate with skills that employers actually need and value."
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-primary mb-4" />,
                title: "Career Support",
                description: "From resume building to interview preparation and job placement assistance, we support your entire career journey."
              },
              {
                icon: <Award className="h-12 w-12 text-primary mb-4" />,
                title: "Industry Recognition",
                description: "Our certificates and portfolio projects are recognized by leading tech companies across Nigeria and internationally."
              },
              {
                icon: <Shield className="h-12 w-12 text-primary mb-4" />,
                title: "Global Standards",
                description: "Our curriculum meets international standards while addressing local market needs and opportunities in Africa."
              },
              {
                icon: <Zap className="h-12 w-12 text-primary mb-4" />,
                title: "Community Network",
                description: "Join a thriving community of learners, alumni, and industry professionals that will support your growth throughout your career."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">TESTIMONIAL</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-4">See what your students say</h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Full Stack Developer",
                content: "GGTL Tech transformed my career completely. The hands-on approach and expert instructors helped me land my dream job.",
                rating: 5
              },
              {
                name: "Michael Adebayo",
                role: "Data Scientist",
                content: "The practical projects and real-world applications made all the difference. I'm now working with leading companies.",
                rating: 5
              },
              {
                name: "Fatima Ibrahim",
                role: "UI/UX Designer",
                content: "The community support and career guidance were exceptional. I felt supported throughout my entire learning journey.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with GGTL Tech. 
              Your future in technology starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link to="/auth">Start Learning Today</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link to="/contact-us">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}