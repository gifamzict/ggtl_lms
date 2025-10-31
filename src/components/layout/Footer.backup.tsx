import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Send, ArrowRight, Heart, Sparkles, BookOpen, Users, Award, Globe } from 'lucide-react';

const PremiumFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Courses', href: '/courses' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' }
    ],
    support: [
      { name: 'Help Center', href: '/support' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Community', href: '/community' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Refund Policy', href: '/refund-policy' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', color: 'hover:bg-blue-600', name: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', color: 'hover:bg-sky-500', name: 'Twitter' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', color: 'hover:bg-blue-700', name: 'LinkedIn' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600', name: 'Instagram' }
  ];

  const stats = [
    { icon: <Users className="h-5 w-5" />, value: '50K+', label: 'Students' },
    { icon: <BookOpen className="h-5 w-5" />, value: '200+', label: 'Courses' },
    { icon: <Award className="h-5 w-5" />, value: '98%', label: 'Success Rate' },
    { icon: <Globe className="h-5 w-5" />, value: '40+', label: 'Countries' }
  ];

  return (
    <footer className= "relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden" >
    {/* Animated Background Elements */ }
    < div className = "absolute inset-0 opacity-10" >
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" > </div>
        < div className = "absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style = {{ animationDelay: '1s' }
}> </div>
  </div>

{/* Grid Pattern */ }
<div className="absolute inset-0 opacity-5" style = {{
  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
    backgroundSize: '40px 40px'
}}> </div>

  < div className = "relative z-10" >
    {/* Newsletter Section */ }
    < div className = "border-b border-white/10" >
      <div className="max-w-7xl mx-auto px-4 py-16" >
        <div className="grid lg:grid-cols-2 gap-12 items-center" >
          <div className="space-y-4" >
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-400/30" >
              <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300" > Stay Updated </span>
                  </div>
                  < h2 className = "text-4xl lg:text-5xl font-black leading-tight" >
                    Get the Latest
                      < br />
                      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" >
                        Learning Updates
                          </span>
                          </h2>
                          < p className = "text-lg text-white/70 leading-relaxed max-w-lg" >
                            Subscribe to our newsletter and never miss new courses, industry insights, and exclusive offers.
                </p>
                              </div>

                              < div className = "space-y-4" >
                                <div className="relative" >
                                  <input
                    type="email"
placeholder = "Enter your email address"
className = "w-full px-6 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all duration-300 pr-40"
  />
  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2" >
    Subscribe
    < Send className = "h-4 w-4" />
      </button>
      </div>
      < p className = "text-sm text-white/60" >
        Join 50,000 + professionals getting weekly updates.Unsubscribe anytime.
                </p>
          </div>
          </div>
          </div>
          </div>

{/* Stats Bar */ }
<div className="border-b border-white/10" >
  <div className="max-w-7xl mx-auto px-4 py-12" >
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8" >
    {
      stats.map((stat, index) => (
        <div key= { index } className = "text-center group" >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform border border-white/20" >
      <div className="text-purple-400" >
      { stat.icon }
      </div>
      </div>
      < div className = "text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1" >
      { stat.value }
      </div>
      < div className = "text-sm text-white/60 font-medium" > { stat.label } </div>
      </div>
      ))
    }
      </div>
      </div>
      </div>

{/* Main Footer Content */ }
<div className="max-w-7xl mx-auto px-4 py-16" >
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12" >
    {/* Brand Section */ }
    < div className = "lg:col-span-4 space-y-6" >
      <div className="flex items-center gap-3" >
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl" >
          <span className="text-white font-black text-xl" > G </span>
            </div>
            < span className = "text-2xl font-black" > GGTL </span>
              </div>
              < p className = "text-white/70 leading-relaxed text-lg" >
                Empowering the next generation of African tech professionals with world - class education and industry - recognized certifications.
              </p>

{/* Social Links */ }
<div>
  <p className="text-sm font-bold text-white/80 mb-4" > Connect With Us </p>
    < div className = "flex gap-3" >
    {
      socialLinks.map((social, index) => (
        <a
                      key= { index }
                      href = { social.href }
                      className = {`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color}`}
aria - label={ social.name }
                    >
  { social.icon }
  </a>
                  ))}
</div>
  </div>
  </div>

{/* Company Links */ }
<div className="lg:col-span-2" >
  <h3 className="text-lg font-bold mb-6 flex items-center gap-2" >
    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" > </div>
Company
  </h3>
  < ul className = "space-y-3" >
  {
    footerLinks.company.map((link, index) => (
      <li key= { index } >
      <a
                      href={ link.href }
                      className = "text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
      >
      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
      { link.name }
      </a>
    </li>
    ))
  }
    </ul>
    </div>

{/* Support Links */ }
<div className="lg:col-span-2" >
  <h3 className="text-lg font-bold mb-6 flex items-center gap-2" >
    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" > </div>
Support
  </h3>
  < ul className = "space-y-3" >
  {
    footerLinks.support.map((link, index) => (
      <li key= { index } >
      <a
                      href={ link.href }
                      className = "text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
      >
      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
      { link.name }
      </a>
    </li>
    ))
  }
    </ul>
    </div>

{/* Legal Links */ }
<div className="lg:col-span-2" >
  <h3 className="text-lg font-bold mb-6 flex items-center gap-2" >
    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" > </div>
Legal
  </h3>
  < ul className = "space-y-3" >
  {
    footerLinks.legal.map((link, index) => (
      <li key= { index } >
      <a
                      href={ link.href }
                      className = "text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
      >
      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
      { link.name }
      </a>
    </li>
    ))
  }
    </ul>
    </div>

{/* Contact Info */ }
<div className="lg:col-span-2" >
  <h3 className="text-lg font-bold mb-6 flex items-center gap-2" >
    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" > </div>
Contact
  </h3>
  < div className = "space-y-4" >
    <div className="flex items-start gap-3 group cursor-pointer" >
      <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20 group-hover:bg-purple-600/30 transition-colors" >
        <Mail className="h-4 w-4 text-purple-400" />
          </div>
          < div >
          <p className="text-sm text-white/50 font-medium" > Email </p>
            < p className = "text-white/90 font-semibold" > info@ggtl.tech</p>
              </div>
              </div>

              < div className = "flex items-start gap-3 group cursor-pointer" >
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20 group-hover:bg-blue-600/30 transition-colors" >
                  <Phone className="h-4 w-4 text-blue-400" />
                    </div>
                    < div >
                    <p className="text-sm text-white/50 font-medium" > Phone </p>
                      < p className = "text-white/90 font-semibold" > +234 707 507 4103 </p>
                        </div>
                        </div>

                        < div className = "flex items-start gap-3 group cursor-pointer" >
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20 group-hover:bg-pink-600/30 transition-colors" >
                            <MapPin className="h-4 w-4 text-pink-400" />
                              </div>
                              < div >
                              <p className="text-sm text-white/50 font-medium" > Location </p>
                                < p className = "text-white/90 font-semibold text-sm leading-relaxed" >
                                  7 Yaya Abatan Rd, Aguda, <br />Lagos 101233, Nigeria
                                    </p>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>

{/* Bottom Bar */ }
<div className="border-t border-white/10" >
  <div className="max-w-7xl mx-auto px-4 py-8" >
    <div className="flex flex-col md:flex-row justify-between items-center gap-6" >
      <div className="flex items-center gap-2 text-white/70" >
        <span>© { currentYear } GGTL.All rights reserved.</span>
          < span className = "hidden md:inline" >•</span>
            < span className = "hidden md:inline flex items-center gap-1" >
              Made with <Heart className= "h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> in Nigeria
                </span>
                </div>

                < div className = "flex flex-wrap justify-center gap-6" >
                  <a href="/privacy-policy" className = "text-white/70 hover:text-white transition-colors text-sm font-medium" >
                    Privacy
                    </a>
                    < a href = "/terms-of-service" className = "text-white/70 hover:text-white transition-colors text-sm font-medium" >
                      Terms
                      </a>
                      < a href = "/cookie-policy" className = "text-white/70 hover:text-white transition-colors text-sm font-medium" >
                        Cookies
                        </a>
                        < a href = "/sitemap" className = "text-white/70 hover:text-white transition-colors text-sm font-medium" >
                          Sitemap
                          </a>
                          </div>
                          </div>
                          </div>
                          </div>
                          </div>
                          </footer>
  );
};

export default PremiumFooter;