import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold">GGTL</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We deliver uniqueness and transparency in tech education, empowering the next generation of African tech professionals.
            </p>
            <div className="flex space-x-4">
              <span className="text-sm font-medium">Follow Us On</span>
            </div>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center hover:bg-blue-900 transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-700 transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Help Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Help Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">More Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blogs
                </a>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Treams
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email us:</p>
                  <p className="text-gray-400 text-sm">info@ggtl.tech</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Call us:</p>
                  <p className="text-gray-400 text-sm">+234 707 507 4103</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Address:</p>
                  <p className="text-gray-400 text-sm">7 Yaya Abatan Rd, Aguda, Lagos 101233, Lagos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © 2025 GGTL. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;