import { motion } from 'framer-motion';
import { BookOpen, Search, TrendingUp, Bell, ChevronDown } from 'lucide-react';
import { useRef, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Features from '../components/Features';

const Home = () => {
  // Refs for scroll functionality
  const searchBarRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Function to scroll to search bar
  const scrollToSearch = () => {
    searchBarRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
    
    // Focus the search input after scrolling
    setTimeout(() => {
      if (searchInputRef.current) {
        const inputElement = searchInputRef.current.querySelector('input');
        if (inputElement) {
          inputElement.focus();
        }
      }
    }, 800); // Delay to allow smooth scroll to complete
  };
  
  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6, // large duration
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.32 }, // medium duration
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="bg-hero-light py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container">
          <motion.div
            className="text-center mb-10"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-poppins font-semibold text-neutral-dark ml-3">
                Book<span className="text-primary">Wise</span>
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-neutral-dark mb-4">
              Find the Best Book Deals Across the Web
            </h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              Compare prices from multiple online bookstores, track price history,
              and get alerts when prices drop.
            </p>
            
            {/* Scroll to Search Button */}
            <motion.button
              onClick={scrollToSearch}
              className="scroll-btn mt-8 flex items-center mx-auto bg-primary text-white px-6 py-3 rounded-full shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2 font-medium">Scroll to Search</span>
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </motion.button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            ref={searchBarRef}
            className="max-w-3xl mx-auto mt-16 pt-8"
            variants={itemVariants}
          >
            <div ref={searchInputRef}>
              <SearchBar size="large" placeholder="Search for books, authors, or ISBN..." />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-dark">10M+</h3>
              <p className="text-neutral-mid">Books Indexed</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-dark">50+</h3>
              <p className="text-neutral-mid">Online Bookstores</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-dark">₹500K+</h3>
              <p className="text-neutral-mid">Saved by Users</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <Features scrollToSearch={scrollToSearch} />

      {/* Popular Categories */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-semibold text-neutral-dark mb-4">
              Popular Categories
            </h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              Browse books by category to find exactly what you're looking for.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Fiction', image: 'https://covers.openlibrary.org/b/id/8601497-M.jpg' },
              { name: 'Non-Fiction', image: 'https://covers.openlibrary.org/b/id/10779397-M.jpg' },
              { name: 'Textbooks', image: 'https://covers.openlibrary.org/b/id/7883192-M.jpg' },
              { name: 'Children\'s Books', image: 'https://covers.openlibrary.org/b/id/12645114-M.jpg' },
            ].map((category, index) => (
              <motion.a
                key={index}
                href={`/search?category=${category.name.toLowerCase()}`}
                className="relative rounded-lg overflow-hidden h-48 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.1 }} // medium duration
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-medium group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">{category.name}</h3>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-semibold text-neutral-dark mb-4">
              What Our Users Say
            </h2>
            <p className="text-neutral-mid max-w-2xl mx-auto">
              Join thousands of book lovers who save money with BookWise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya S.',
                role: 'Student',
                quote: 'BookWise helped me save over ₹2,000 on my textbooks this semester. The price alerts feature is a game-changer!',
              },
              {
                name: 'Rahul M.',
                role: 'Book Collector',
                quote: 'I love being able to track price history. It helped me understand the best time to buy and saved me a lot of money.',
              },
              {
                name: 'Ananya K.',
                role: 'Avid Reader',
                quote: 'The comparison feature is fantastic! I no longer have to check multiple sites to find the best deal on books.',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.1 }} // medium duration
                viewport={{ once: true }}
              >
                <p className="text-neutral-dark mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-neutral-dark">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-mid">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-poppins font-semibold mb-4">
            Ready to Start Saving on Books?
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of readers who use BookWise to find the best deals on their favorite books.
          </p>
          <motion.button
            onClick={scrollToSearch}
            className="scroll-btn bg-white text-primary font-medium px-8 py-3 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Comparing Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Home;