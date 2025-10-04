import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Award, Bell, X, ChevronDown, ChevronUp } from 'lucide-react';
import PropTypes from 'prop-types';
import { formatPrice } from '../utils/format';

const ComparisonStrip = ({ books, onSetAlert, onViewDetails }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Find the cheapest book
  const cheapestBook = books.reduce((cheapest, current) => {
    const cheapestOffer = current.offers?.reduce((cheapOffer, offer) => 
      offer.price < cheapOffer.price ? offer : cheapOffer, current.offers[0]);
    
    const currentCheapestPrice = cheapestOffer?.price || Infinity;
    
    if (!cheapest || currentCheapestPrice < cheapest.price) {
      return { 
        book: current, 
        offer: cheapestOffer, 
        price: currentCheapestPrice 
      };
    }
    
    return cheapest;
  }, null);
  
  // Find the fastest delivery
  const fastestDelivery = books.reduce((fastest, current) => {
    // Simple heuristic: check if shipping contains "1-day" or "same day"
    const fastOffer = current.offers?.find(offer => 
      offer.shipping?.toLowerCase().includes('1-day') || 
      offer.shipping?.toLowerCase().includes('same day')
    );
    
    if (fastOffer && (!fastest || !fastest.offer)) {
      return { book: current, offer: fastOffer };
    }
    
    return fastest;
  }, null);
  
  // Find the AI recommended "best overall"
  const bestOverall = books.find(book => 
    book.ai_recommendation?.type === 'best_overall' || 
    book.ai_recommendation?.type === 'best_value'
  );
  
  // Animation variants
  const stripVariants = {
    expanded: { 
      height: 'auto',
      transition: { duration: 0.32 } // medium duration
    },
    collapsed: { 
      height: '56px',
      transition: { duration: 0.32 } // medium duration
    }
  };
  
  const contentVariants = {
    expanded: { 
      opacity: 1,
      transition: { duration: 0.18 } // micro duration
    },
    collapsed: { 
      opacity: 0,
      transition: { duration: 0.18 } // micro duration
    }
  };
  
  return (
    <motion.div 
      className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm"
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={stripVariants}
    >
      {/* Mobile toggle button */}
      <button
        className="md:hidden absolute right-4 -bottom-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm z-20"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand comparison strip" : "Collapse comparison strip"}
      >
        {isCollapsed ? (
          <ChevronDown className="h-5 w-5 text-neutral-mid" />
        ) : (
          <ChevronUp className="h-5 w-5 text-neutral-mid" />
        )}
      </button>
      
      <div className="container py-3">
        {/* Header - Always visible */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-dark">Compare Options</h2>
          <button
            className="hidden md:flex items-center text-sm text-neutral-mid hover:text-neutral-dark"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? 'Show comparison' : 'Hide comparison'}
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 ml-1" />
            ) : (
              <ChevronUp className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
        
        {/* Comparison Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3"
          variants={contentVariants}
        >
          {/* Cheapest Option */}
          {cheapestBook && (
            <div 
              className="bg-gray-50 rounded-lg p-3 border border-gray-100 cursor-pointer hover:border-primary transition-colors duration-micro"
              onClick={() => onViewDetails(cheapestBook.book)}
            >
              <div className="flex items-center text-primary mb-2">
                <Zap className="h-5 w-5 mr-2" />
                <span className="font-medium">Cheapest Option</span>
              </div>
              
              <div className="flex items-start">
                {cheapestBook.book.cover && (
                  <img 
                    src={cheapestBook.book.cover} 
                    alt={cheapestBook.book.title}
                    className="h-16 w-12 object-cover rounded mr-3"
                  />
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-dark line-clamp-1">
                    {cheapestBook.book.title}
                  </h3>
                  <p className="text-xs text-neutral-mid line-clamp-1">
                    {cheapestBook.offer.platform}
                  </p>
                  <p className="text-lg font-semibold text-action mt-1">
                    {formatPrice(cheapestBook.price, cheapestBook.offer.currency)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Best Overall */}
          {bestOverall && (
            <div 
              className="bg-gray-50 rounded-lg p-3 border border-gray-100 cursor-pointer hover:border-primary transition-colors duration-micro"
              onClick={() => onViewDetails(bestOverall)}
            >
              <div className="flex items-center text-primary mb-2">
                <Award className="h-5 w-5 mr-2" />
                <span className="font-medium">Best Overall</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">AI Pick</span>
              </div>
              
              <div className="flex items-start">
                {bestOverall.cover && (
                  <img 
                    src={bestOverall.cover} 
                    alt={bestOverall.title}
                    className="h-16 w-12 object-cover rounded mr-3"
                  />
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-dark line-clamp-1">
                    {bestOverall.title}
                  </h3>
                  <p className="text-xs text-neutral-mid line-clamp-2">
                    {bestOverall.ai_recommendation?.reason || 'Recommended based on overall value'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Fastest Delivery */}
          {fastestDelivery && (
            <div 
              className="bg-gray-50 rounded-lg p-3 border border-gray-100 cursor-pointer hover:border-primary transition-colors duration-micro"
              onClick={() => onViewDetails(fastestDelivery.book)}
            >
              <div className="flex items-center text-primary mb-2">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Fastest Delivery</span>
              </div>
              
              <div className="flex items-start">
                {fastestDelivery.book.cover && (
                  <img 
                    src={fastestDelivery.book.cover} 
                    alt={fastestDelivery.book.title}
                    className="h-16 w-12 object-cover rounded mr-3"
                  />
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-dark line-clamp-1">
                    {fastestDelivery.book.title}
                  </h3>
                  <p className="text-xs text-neutral-mid line-clamp-1">
                    {fastestDelivery.offer.platform}
                  </p>
                  <p className="text-sm font-medium text-action mt-1">
                    {fastestDelivery.offer.shipping}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Set Alert CTA */}
        <motion.div 
          className="mt-4 flex justify-center"
          variants={contentVariants}
        >
          <button
            className="btn-outline flex items-center text-primary border-primary"
            onClick={() => {
              const bestBook = bestOverall || cheapestBook?.book;
              if (bestBook) {
                onSetAlert(bestBook);
              }
            }}
            disabled={!bestOverall && !cheapestBook}
          >
            <Bell className="h-4 w-4 mr-2" />
            Set Price Alert
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

ComparisonStrip.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      book_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      cover: PropTypes.string,
      offers: PropTypes.arrayOf(
        PropTypes.shape({
          platform: PropTypes.string.isRequired,
          platform_id: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
          currency: PropTypes.string,
          shipping: PropTypes.string,
        })
      ),
      ai_recommendation: PropTypes.shape({
        type: PropTypes.string,
        reason: PropTypes.string,
      }),
    })
  ).isRequired,
  onSetAlert: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default ComparisonStrip;