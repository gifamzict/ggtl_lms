import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, BookOpen, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About GGTL Tech
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation of tech professionals across Nigeria and Africa 
            with world-class education, practical skills, and career opportunities.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="bg-card border-border">
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

            <Card className="bg-card border-border">
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
          </div>
        </div>
      </section>

      {/* Why Choose GGTL Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose GGTL Tech?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We offer more than just courses – we provide a complete learning ecosystem 
              designed for your success in the tech industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Expert Instructors</h3>
                <p className="text-muted-foreground">
                  Learn from industry professionals with years of real-world experience 
                  in top tech companies and successful startups.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Practical Skills</h3>
                <p className="text-muted-foreground">
                  Hands-on projects and real-world applications ensure you graduate 
                  with skills that employers actually need and value.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Career Support</h3>
                <p className="text-muted-foreground">
                  From resume building to interview preparation and job placement assistance, 
                  we support your entire career journey.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Industry Recognition</h3>
                <p className="text-muted-foreground">
                  Our certificates and portfolio projects are recognized by leading 
                  tech companies across Nigeria and internationally.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Global Standards</h3>
                <p className="text-muted-foreground">
                  Our curriculum meets international standards while addressing 
                  local market needs and opportunities in Africa.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Community Network</h3>
                <p className="text-muted-foreground">
                  Join a thriving community of learners, alumni, and industry professionals 
                  that will support your growth throughout your career.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-8">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                GGTL Tech was founded with a simple yet powerful vision: to make quality 
                technology education accessible to everyone across Africa. Recognizing the 
                massive digital skills gap in our continent, we set out to create a learning 
                platform that combines global best practices with local insights.
              </p>
              <p>
                Our journey began with a team of passionate educators and industry professionals 
                who understood that traditional education systems weren't keeping pace with 
                the rapidly evolving tech landscape. We knew that Africa needed a new approach – 
                one that was practical, relevant, and designed for the modern workforce.
              </p>
              <p>
                Today, GGTL Tech stands as a beacon of educational innovation, having trained 
                thousands of students who now work in leading tech companies, run successful 
                startups, and drive digital transformation across various industries. Our 
                alumni network spans across Nigeria, Africa, and the global tech ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
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
        </div>
      </section>
    </div>
  );
}