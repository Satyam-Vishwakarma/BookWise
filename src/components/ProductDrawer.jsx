import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  X, 
  ExternalLink, 
  Bell, 
  Award, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import PropTypes from 'prop-types';
import { formatPrice, formatAuthors, formatDate } from '../utils/format';
import PriceSparkline from './PriceSparkline';
import { usePriceHistory } from '../hooks/useBookDetail';
import { endpoints, useMockData } from '../services/api';

const ProductDrawer = ({ book, isOpen, onClose, onSetAlert }) => {
  const [alertSuccess, setAlertSuccess] = useState(false);
  const drawerRef = useRef(null);
  const isMockMode = useMockData();
  
  // Fetch price history data
  const { data: priceHistory, isLoading: isLoadingPriceHistory } = usePriceHistory(
    isOpen && book?.book_id ? book.book_id : null
  );
  
  // Form handling for price alerts
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      target_price: book?.offers?.[0]?.price 
        ? Math.floor(book.offers[0].price * 0.9) // Default to 10% less than current price
        : '',
      notify_via: 'email',
      email: '',
      phone: ''
    }
  });
  
  // Reset form when book changes
  useEffect(() => {
    if (book && isOpen) {
      reset({
        target_price: book.offers?.[0]?.price 
          ? Math.floor(book.offers[0].price * 0.9)
          : '',
        notify_via: 'email',
        email: '',
        phone: ''
      });
      setAlertSuccess(false);
    }
  }, [book, isOpen, reset]);
  
  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
  
  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen) return;
    
    const drawer = drawerRef.current;
    if (!drawer) return;
    
    const focusableElements = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    drawer.addEventListener('keydown', handleTabKey);
    firstElement.focus();
    
    return () => {
      drawer.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (isMockMode) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setAlertSuccess(true);
      } else {
        // Real API call
        await endpoints.createAlert({
          book_id: book.book_id,
          target_price: data.target_price,
          notify_via: data.notify_via,
          contact: data.notify_via === 'email' ? data.email : data.phone
        });
        setAlertSuccess(true);
      }
    } catch (error) {
      console.error('Error setting price alert:', error);
      // Would show toast notification here
    }
  };
  
  // Drawer animation variants
  const drawerVariants = {
    hidden: { 
      x: '100%',
      transition: { duration: 0.32, ease: 'easeInOut' } // medium duration
    },
    visible: { 
      x: 0,
      transition: { duration: 0.32, ease: 'easeInOut' } // medium duration
    }
  };
  
  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0, transition: { duration: 0.18 } }, // micro duration
    visible: { opacity: 1, transition: { duration: 0.18 } } // micro duration
  };
  
  if (!book) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-xl z-50 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
              <div className="flex items-center justify-between p-4">
                <h2 id="drawer-title" className="text-xl font-medium text-neutral-dark">Book Details</h2>
                <button
                  className="p-1 rounded-full hover:bg-gray-100 text-neutral-mid hover:text-neutral-dark transition-colors duration-micro"
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {/* Book Info */}
              <div className="flex mb-6">
                <div className="flex-shrink-0 w-24 h-36 bg-gray-100 rounded overflow-hidden">
                  {book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      No Cover
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-neutral-dark">{book.title}</h3>
                  {book.subtitle && (
                    <p className="text-sm text-neutral-mid mt-1">{book.subtitle}</p>
                  )}
                  <p className="text-sm mt-2">{formatAuthors(book.authors)}</p>
                  
                  {book.publisher && (
                    <p className="text-sm text-neutral-mid mt-1">
                      {book.publisher}
                      {book.published_date && ` • ${formatDate(book.published_date, { year: 'numeric' })}`}
                    </p>
                  )}
                  
                  {book.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-lg ${i < Math.round(book.rating) ? 'text-accent' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium ml-2">{book.rating.toFixed(1)}</span>
                      <span className="text-xs text-neutral-mid ml-1">
                        ({book.rating_count.toLocaleString()} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* AI Recommendation */}
              {book.ai_recommendation && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
                  <div className="flex items-center text-blue-800 mb-1">
                    <Award className="h-5 w-5 mr-2" />
                    <span className="font-medium">AI Recommendation</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 rounded">
                      {book.ai_recommendation.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">{book.ai_recommendation.reason}</p>
                </div>
              )}
              
              {/* Price Trend */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-neutral-dark mb-3">Price Trend</h4>
                {isLoadingPriceHistory ? (
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                    <div className="animate-pulse text-neutral-mid">Loading price history...</div>
                  </div>
                ) : priceHistory && priceHistory.length > 0 ? (
                  <PriceSparkline 
                    data={priceHistory} 
                    currency={book.offers?.[0]?.currency || 'INR'}
                    height={160}
                  />
                ) : (
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-neutral-mid">
                    No price history available
                  </div>
                )}
              </div>
              
              {/* Price Comparison */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-neutral-dark mb-3">Price Comparison</h4>
                {book.offers && book.offers.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-neutral-dark">Platform</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-neutral-dark">Price</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-neutral-dark">Shipping</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-neutral-dark"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {book.offers.map((offer) => (
                          <tr key={offer.platform_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium">{offer.platform}</div>
                              <div className="text-xs text-neutral-mid">
                                Last checked: {formatDate(offer.last_checked, { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              {formatPrice(offer.price, offer.currency)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {offer.shipping}
                              {offer.is_prime && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Prime</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <a
                                href={offer.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-xs px-3 py-1 flex items-center inline-flex"
                              >
                                Buy
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-neutral-mid">
                    No offers available for this book
                  </div>
                )}
              </div>
              
              {/* Set Price Alert */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-neutral-dark mb-3">Set Price Alert</h4>
                
                {alertSuccess ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                    <ShieldCheck className="h-8 w-8 text-action mx-auto mb-2" />
                    <h5 className="text-action font-medium">Alert Set Successfully!</h5>
                    <p className="text-sm text-neutral-dark mt-1">
                      We'll notify you when the price drops below your target.
                    </p>
                    <button
                      className="mt-3 text-sm text-primary font-medium"
                      onClick={() => setAlertSuccess(false)}
                    >
                      Set another alert
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-4">
                      <label htmlFor="target_price" className="block text-sm font-medium text-neutral-dark mb-1">
                        Target Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-neutral-mid">₹</span>
                        </div>
                        <input
                          id="target_price"
                          type="number"
                          className={`input pl-8 ${errors.target_price ? 'border-red-500' : ''}`}
                          placeholder="Enter target price"
                          {...register('target_price', { 
                            required: 'Target price is required',
                            min: { value: 1, message: 'Price must be at least 1' },
                            valueAsNumber: true
                          })}
                        />
                      </div>
                      {errors.target_price && (
                        <p className="mt-1 text-xs text-red-500">{errors.target_price.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-dark mb-1">
                        Notify me via
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="email"
                            className="form-radio text-primary"
                            {...register('notify_via')}
                          />
                          <span className="ml-2 text-sm">Email</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="sms"
                            className="form-radio text-primary"
                            {...register('notify_via')}
                          />
                          <span className="ml-2 text-sm">SMS</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Conditional field based on notification method */}
                    {watch('notify_via') === 'email' ? (
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={`input ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="your@email.com"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-dark mb-1">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className={`input ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="Your phone number"
                          {...register('phone', { 
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'Invalid phone number (10 digits required)'
                            }
                          })}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                        )}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Set Price Alert
                    </button>
                  </form>
                )}
              </div>
              
              {/* Book Details */}
              {book.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-neutral-dark mb-3">Description</h4>
                  <p className="text-sm text-neutral-dark">{book.description}</p>
                </div>
              )}
              
              {/* Book Metadata */}
              {(book.categories?.length > 0 || book.page_count || book.language) && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-medium text-neutral-dark mb-3">Additional Information</h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {book.categories?.length > 0 && (
                      <>
                        <dt className="text-sm font-medium text-neutral-dark">Categories</dt>
                        <dd className="text-sm text-neutral-mid">{book.categories.join(', ')}</dd>
                      </>
                    )}
                    
                    {book.page_count > 0 && (
                      <>
                        <dt className="text-sm font-medium text-neutral-dark">Pages</dt>
                        <dd className="text-sm text-neutral-mid">{book.page_count}</dd>
                      </>
                    )}
                    
                    {book.language && (
                      <>
                        <dt className="text-sm font-medium text-neutral-dark">Language</dt>
                        <dd className="text-sm text-neutral-mid">
                          {book.language === 'en' ? 'English' : book.language}
                        </dd>
                      </>
                    )}
                    
                    {book.book_id && (
                      <>
                        <dt className="text-sm font-medium text-neutral-dark">ISBN</dt>
                        <dd className="text-sm text-neutral-mid">
                          {book.book_id.replace('ISBN:', '')}
                        </dd>
                      </>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

ProductDrawer.propTypes = {
  book: PropTypes.shape({
    book_id: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    publisher: PropTypes.string,
    published_date: PropTypes.string,
    description: PropTypes.string,
    page_count: PropTypes.number,
    categories: PropTypes.arrayOf(PropTypes.string),
    language: PropTypes.string,
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
        last_checked: PropTypes.string,
      })
    ),
    ai_recommendation: PropTypes.shape({
      type: PropTypes.string,
      reason: PropTypes.string,
    }),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSetAlert: PropTypes.func,
};

export default ProductDrawer;