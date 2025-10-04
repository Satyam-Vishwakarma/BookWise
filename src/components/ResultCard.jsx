import { motion } from 'framer-motion';
import { ExternalLink, Star, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { formatPrice, formatAuthors, getBestOffer } from '../utils/format';

const ResultCard = ({ book, onViewDetails }) => {
  const bestOffer = getBestOffer(book.offers);
  
  // Platform icons (simplified - in a real app, would use actual logos)
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'amazon':
        return '🛒'; // Would use actual Amazon logo
      case 'flipkart':
        return '🛍️'; // Would use actual Flipkart logo
      case 'bookswagon':
        return '📚'; // Would use actual Bookswagon logo
      default:
        return '🏪'; // Generic store icon
    }
  };
  
  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.32 } // medium duration
    },
    hover: { 
      y: -5,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.18 } // micro duration
    }
  };
  
  return (
    <motion.div
      className="card overflow-hidden"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={() => onViewDetails(book)}
    >
      <div className="flex p-4 cursor-pointer">
        {/* Book Cover */}
        <div className="flex-shrink-0 w-24 h-36 bg-gray-100 rounded overflow-hidden">
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              No Cover
            </div>
          )}
        </div>
        
        {/* Book Details */}
        <div className="flex-1 ml-4">
          <h3 className="text-lg font-medium text-neutral-dark line-clamp-2">{book.title}</h3>
          <p className="text-sm text-neutral-mid mt-1">{formatAuthors(book.authors)}</p>
          
          {/* Rating */}
          {book.rating && (
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-accent fill-current" />
              <span className="text-sm font-medium ml-1">{book.rating.toFixed(1)}</span>
              <span className="text-xs text-neutral-mid ml-1">
                ({book.rating_count.toLocaleString()} reviews)
              </span>
            </div>
          )}
          
          {/* Platform Offers */}
          <div className="mt-3 space-y-1.5">
            {book.offers?.slice(0, 2).map((offer) => (
              <div key={offer.platform_id} className="flex items-center">
                <span className="mr-2">{getPlatformIcon(offer.platform)}</span>
                <span className="text-sm">{offer.platform}</span>
                <span className="mx-2 text-neutral-mid">•</span>
                <span className="text-sm font-medium">{formatPrice(offer.price, offer.currency)}</span>
                {offer.is_prime && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Prime</span>
                )}
              </div>
            ))}
            
            {book.offers?.length > 2 && (
              <div className="text-xs text-primary">
                +{book.offers.length - 2} more offers
              </div>
            )}
          </div>
          
          {/* View Details Link */}
          <button 
            className="mt-3 text-sm text-primary font-medium flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(book);
            }}
          >
            View details
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Price and Buy Button */}
        <div className="flex flex-col items-end justify-between ml-4">
          {bestOffer && (
            <>
              <div className="text-right">
                <div className="text-xl font-semibold text-neutral-dark">
                  {formatPrice(bestOffer.price, bestOffer.currency)}
                </div>
                <div className="text-xs text-neutral-mid">
                  {bestOffer.shipping}
                </div>
              </div>
              
              <a
                href={bestOffer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 px-4 py-2 flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                Buy
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

ResultCard.propTypes = {
  book: PropTypes.shape({
    book_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.string,
    rating: PropTypes.number,
    rating_count: PropTypes.number,
    offers: PropTypes.arrayOf(
      PropTypes.shape({
        platform: PropTypes.string.isRequired,
        platform_id: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        currency: PropTypes.string,
        shipping: PropTypes.string,
        link: PropTypes.string.isRequired,
        is_prime: PropTypes.bool,
      })
    ),
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default ResultCard;