import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import ResultCard from '../components/ResultCard';
import SkeletonCard from '../components/SkeletonCard';
import ComparisonStrip from '../components/ComparisonStrip';
import ProductDrawer from '../components/ProductDrawer';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useState(new URLSearchParams(location.search));
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  // State for filters
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    platforms: [],
    rating: 0,
    availability: [],
    category: category || '',
  });
  
  // State for mobile filters visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // State for product drawer
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    
    if (filters.category) {
      newParams.set('category', filters.category);
    } else {
      newParams.delete('category');
    }
    
    // Only update URL if filters have changed
    if (newParams.toString() !== searchParams.toString()) {
      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    }
  }, [filters, location.pathname, navigate, searchParams]);
  
  // Fetch search results
  const { data, isLoading, error } = useSearch(query);
  
  // Handle view details
  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };
  
  // Handle set alert
  const handleSetAlert = (book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };
  
  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (e, index) => {
    const newValue = parseInt(e.target.value, 10);
    setFilters(prev => {
      const newRange = [...prev.priceRange];
      newRange[index] = newValue;
      return {
        ...prev,
        priceRange: newRange,
      };
    });
  };
  
  // Handle platform filter toggle
  const handlePlatformToggle = (platform) => {
    setFilters(prev => {
      const platforms = [...prev.platforms];
      if (platforms.includes(platform)) {
        return {
          ...prev,
          platforms: platforms.filter(p => p !== platform),
        };
      } else {
        return {
          ...prev,
          platforms: [...platforms, platform],
        };
      }
    });
  };
  
  // Handle rating filter change
  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating,
    }));
  };
  
  // Handle availability filter toggle
  const handleAvailabilityToggle = (availability) => {
    setFilters(prev => {
      const availabilityList = [...prev.availability];
      if (availabilityList.includes(availability)) {
        return {
          ...prev,
          availability: availabilityList.filter(a => a !== availability),
        };
      } else {
        return {
          ...prev,
          availability: [...availabilityList, availability],
        };
      }
    });
  };
  
  // Filter results based on filters
  const filteredResults = data?.results?.filter(book => {
    // Filter by price range
    const cheapestOffer = book.offers?.reduce((min, offer) => 
      offer.price < min.price ? offer : min, book.offers[0]);
    
    if (cheapestOffer && (cheapestOffer.price < filters.priceRange[0] || cheapestOffer.price > filters.priceRange[1])) {
      return false;
    }
    
    // Filter by platforms
    if (filters.platforms.length > 0) {
      const bookPlatforms = book.offers?.map(offer => offer.platform) || [];
      if (!filters.platforms.some(platform => bookPlatforms.includes(platform))) {
        return false;
      }
    }
    
    // Filter by rating
    if (filters.rating > 0 && book.rating < filters.rating) {
      return false;
    }
    
    // Filter by availability
    if (filters.availability.includes('prime') && !book.offers?.some(offer => offer.is_prime)) {
      return false;
    }
    
    if (filters.availability.includes('free_shipping') && 
        !book.offers?.some(offer => offer.shipping?.toLowerCase().includes('free'))) {
      return false;
    }
    
    return true;
  }) || [];
  
  // Animation variants
  const filterVariants = {
    hidden: { 
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.32 } // medium duration
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { duration: 0.32 } // medium duration
    }
  };
  
  const resultVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.32 } // medium duration
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Results Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container">
          <h1 className="text-2xl font-poppins font-semibold text-neutral-dark">
            {query ? `Search Results for "${query}"` : 
             category ? `Browse ${category}` : 
             'All Books'}
          </h1>
          <p className="text-neutral-mid mt-1">
            {isLoading ? 'Searching...' : 
             error ? 'Error loading results' : 
             data?.results ? `Found ${data.total_results} results` : 
             'No results found'}
          </p>
        </div>
      </div>
      
      {/* Comparison Strip */}
      {!isLoading && filteredResults.length > 0 && (
        <ComparisonStrip 
          books={filteredResults} 
          onSetAlert={handleSetAlert}
          onViewDetails={handleViewDetails}
        />
      )}
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 py-2">
        <div className="container">
          <button
            className="flex items-center justify-center w-full py-2 bg-gray-100 rounded-md text-neutral-dark hover:bg-gray-200 transition-colors duration-micro"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </button>
        </div>
      </div>
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.aside
                className="w-full md:w-64 flex-shrink-0"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-16">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-neutral-dark">Filters</h2>
                    {showFilters && (
                      <button
                        className="md:hidden text-neutral-mid hover:text-neutral-dark"
                        onClick={() => setShowFilters(false)}
                        aria-label="Close filters"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-dark mb-2">Price Range</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-mid">₹{filters.priceRange[0]}</span>
                      <span className="text-sm text-neutral-mid">₹{filters.priceRange[1]}</span>
                    </div>
                    <div className="flex space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="100"
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(e, 0)}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="100"
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(e, 1)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Platform Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-dark mb-2">Platforms</h3>
                    {['Amazon', 'Flipkart', 'Bookswagon'].map((platform) => (
                      <label key={platform} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={filters.platforms.includes(platform)}
                          onChange={() => handlePlatformToggle(platform)}
                          className="form-checkbox text-primary h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-neutral-dark">{platform}</span>
                      </label>
                    ))}
                  </div>
                  
                  {/* Rating Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-dark mb-2">Minimum Rating</h3>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className={`h-8 w-8 flex items-center justify-center rounded-full mr-1 ${
                            filters.rating >= rating ? 'bg-primary text-white' : 'bg-gray-100 text-neutral-mid'
                          }`}
                          onClick={() => handleRatingChange(rating === filters.rating ? 0 : rating)}
                        >
                          {rating}
                        </button>
                      ))}
                      {filters.rating > 0 && (
                        <button
                          className="text-xs text-neutral-mid hover:text-neutral-dark ml-2"
                          onClick={() => handleRatingChange(0)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Availability Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-dark mb-2">Availability</h3>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={filters.availability.includes('prime')}
                        onChange={() => handleAvailabilityToggle('prime')}
                        className="form-checkbox text-primary h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-neutral-dark">Prime Eligible</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.availability.includes('free_shipping')}
                        onChange={() => handleAvailabilityToggle('free_shipping')}
                        className="form-checkbox text-primary h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-neutral-dark">Free Shipping</span>
                    </label>
                  </div>
                  
                  {/* Reset Filters */}
                  <button
                    className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors duration-micro"
                    onClick={() => setFilters({
                      priceRange: [0, 2000],
                      platforms: [],
                      rating: 0,
                      availability: [],
                      category: category || '',
                    })}
                  >
                    Reset All Filters
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
          
          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-4">
                <SkeletonCard count={5} />
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-medium text-neutral-dark mb-2">Error Loading Results</h2>
                <p className="text-neutral-mid mb-4">
                  We encountered an error while loading the search results. Please try again.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : filteredResults.length > 0 ? (
              <motion.div
                className="space-y-4"
                variants={resultVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredResults.map((book) => (
                  <motion.div key={book.book_id} variants={itemVariants}>
                    <ResultCard
                      book={book}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-medium text-neutral-dark mb-2">No Results Found</h2>
                <p className="text-neutral-mid mb-4">
                  We couldn't find any books matching your search criteria.
                  Try adjusting your filters or search for something else.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Drawer */}
      <ProductDrawer
        book={selectedBook}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSetAlert={handleSetAlert}
      />
    </div>
  );
};

export default SearchResults;