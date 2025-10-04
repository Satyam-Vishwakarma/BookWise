/**
 * Format a price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: 'INR')
 * @returns {string} Formatted price with currency symbol
 */
export const formatPrice = (price, currency = 'INR') => {
  if (price === undefined || price === null) return 'N/A';
  
  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format with commas for thousands
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price);
  
  return `${symbol}${formattedPrice}`;
};

/**
 * Format a date to a readable string
 * @param {string} dateString - The date string to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Default options
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a rating to display with stars
 * @param {number} rating - The rating value (0-5)
 * @returns {string} Rating with stars
 */
export const formatRating = (rating) => {
  if (rating === undefined || rating === null) return 'No rating';
  
  const roundedRating = Math.round(rating * 10) / 10;
  return `${roundedRating.toFixed(1)}★`;
};

/**
 * Truncate text with ellipsis if it exceeds maxLength
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Format authors list to a readable string
 * @param {Array<string>} authors - List of author names
 * @returns {string} Formatted authors string
 */
export const formatAuthors = (authors) => {
  if (!authors || !authors.length) return 'Unknown Author';
  
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  
  return `${authors[0]} et al.`;
};

/**
 * Get the best offer from a list of offers
 * @param {Array<Object>} offers - List of offers
 * @param {string} criteria - Criteria for selecting the best offer ('price', 'shipping', etc.)
 * @returns {Object|null} The best offer or null if no offers
 */
export const getBestOffer = (offers, criteria = 'price') => {
  if (!offers || !offers.length) return null;
  
  if (criteria === 'price') {
    return offers.reduce((best, current) => 
      (current.price < best.price) ? current : best, offers[0]);
  }
  
  // Add other criteria as needed
  
  return offers[0];
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - The original price
 * @param {number} currentPrice - The current price
 * @returns {number|null} Discount percentage or null if invalid input
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return null;
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};