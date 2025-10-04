import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

const NavLink = ({ to, children, isMobile = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`${
        isActive
          ? 'text-primary font-medium'
          : 'text-neutral-dark hover:text-primary'
      } ${
        isMobile ? 'block py-2' : 'inline-flex items-center px-1 py-2'
      } transition-colors duration-micro`}
    >
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isMobile: PropTypes.bool,
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-poppins font-semibold text-neutral-dark">
              Book<span className="text-primary">Wise</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/">Home</NavLink>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-neutral-dark hover:text-primary transition-colors duration-micro">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-medium">
                <div className="py-1">
                  <Link to="/search?category=fiction" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-gray-100">Fiction</Link>
                  <Link to="/search?category=non-fiction" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-gray-100">Non-Fiction</Link>
                  <Link to="/search?category=textbooks" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-gray-100">Textbooks</Link>
                  <Link to="/search?category=children" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-gray-100">Children's Books</Link>
                </div>
              </div>
            </div>
            <NavLink to="/search">Browse</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-neutral-dark hover:text-primary focus:outline-none focus:text-primary"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-2 space-y-1 pb-4">
            <NavLink to="/" isMobile>Home</NavLink>
            <div className="py-2">
              <span className="block text-neutral-dark font-medium mb-1">Categories</span>
              <div className="pl-4 space-y-1">
                <Link to="/search?category=fiction" className="block py-1 text-neutral-dark hover:text-primary">Fiction</Link>
                <Link to="/search?category=non-fiction" className="block py-1 text-neutral-dark hover:text-primary">Non-Fiction</Link>
                <Link to="/search?category=textbooks" className="block py-1 text-neutral-dark hover:text-primary">Textbooks</Link>
                <Link to="/search?category=children" className="block py-1 text-neutral-dark hover:text-primary">Children's Books</Link>
              </div>
            </div>
            <NavLink to="/search" isMobile>Browse</NavLink>
            <NavLink to="/about" isMobile>About</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;