import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-dark text-white py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-poppins font-semibold">
                Book<span className="text-primary">Wise</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              BookWise helps you find the best deals on books across multiple platforms.
              Compare prices, set alerts, and make informed purchasing decisions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors duration-micro"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors duration-micro"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@bookwise.example.com" 
                className="text-gray-300 hover:text-primary transition-colors duration-micro"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?category=fiction" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  Fiction
                </Link>
              </li>
              <li>
                <Link to="/search?category=non-fiction" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link to="/search?category=textbooks" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  Textbooks
                </Link>
              </li>
              <li>
                <Link to="/search?category=children" className="text-gray-300 hover:text-primary transition-colors duration-micro">
                  Children's Books
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {currentYear} BookWise. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-primary transition-colors duration-micro">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-micro">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;