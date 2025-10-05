import { motion } from 'framer-motion';
import { Search, TrendingUp, Bell, Zap, ShieldCheck, BarChart3 } from 'lucide-react';
import PropTypes from 'prop-types';

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Compare Prices',
    description: 'Find the best deals by comparing book prices across multiple online stores and platforms.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Track Price History',
    description: 'View price trends over time to make informed decisions about when to buy.',
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: 'Price Alerts',
    description: 'Set alerts and get notified when prices drop below your target threshold.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Instant Comparison',
    description: 'Quickly see the cheapest, fastest delivery, and best overall options at a glance.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Trusted Retailers',
    description: 'We only compare prices from reputable and verified online bookstores.',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'AI Recommendations',
    description: 'Get smart recommendations based on price, shipping, seller ratings, and more.',
  },
];

const Features = ({ scrollToSearch }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section className="py-16 bg-hero-light">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-neutral-dark mb-4">
            Why Choose BookWise?
          </h2>
          <p className="text-neutral-mid max-w-2xl mx-auto">
            BookWise helps you find the best deals on books with powerful price comparison
            tools and smart features designed to save you money.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-medium"
              variants={itemVariants}
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-neutral-dark mb-2">{feature.title}</h3>
              <p className="text-neutral-mid">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <motion.button
            onClick={scrollToSearch}
            className="scroll-btn bg-primary text-white font-medium px-8 py-3 rounded-full shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Comparing Prices
          </motion.button>
        </div>
      </div>
    </section>
  );
};

Features.propTypes = {
  scrollToSearch: PropTypes.func.isRequired,
};

export default Features;