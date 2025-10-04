import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useSearchSuggestions } from '../hooks/useSearch';
import { formatAuthors, truncateText } from '../utils/format';

const SearchBar = ({ size = 'large', placeholder = 'Search for books, authors, or ISBN...' }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  
  // Debounce the search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Fetch search suggestions
  const { data: suggestions, isLoading } = useSearchSuggestions(
    debouncedQuery.length > 1 ? debouncedQuery : ''
  );
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle search submission
  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false);
    }
  };
  
  // Handle key press events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };
  
  // Clear the search input
  const handleClearSearch = () => {
    setQuery('');
    inputRef.current.focus();
  };
  
  // Select a suggestion
  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
  };
  
  // Determine size classes
  const sizeClasses = {
    small: 'h-10 text-sm',
    medium: 'h-12 text-base',
    large: 'h-14 text-lg',
  };
  
  // Suggestions animation variants
  const suggestionsVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.18 } 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.18 } 
    },
  };
  
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className={`relative flex items-center ${sizeClasses[size]}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-mid" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-white focus:ring-2 focus:ring-primary focus:border-primary ${sizeClasses[size]}`}
          aria-label="Search"
          autoComplete="off"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-mid hover:text-neutral-dark"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Search Suggestions */}
      <AnimatePresence>
        {isFocused && debouncedQuery.length > 1 && (
          <motion.div
            ref={suggestionsRef}
            className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={suggestionsVariants}
          >
            {isLoading ? (
              <div className="p-4 text-center text-neutral-mid">
                Loading suggestions...
              </div>
            ) : suggestions?.results?.length > 0 ? (
              <ul className="py-1">
                {suggestions.results.map((suggestion) => (
                  <li key={suggestion.book_id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="flex items-start w-full px-4 py-2 hover:bg-gray-50 text-left"
                    >
                      {suggestion.cover && (
                        <img 
                          src={suggestion.cover} 
                          alt={suggestion.title}
                          className="h-12 w-8 object-cover mr-3 rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-dark truncate">
                          {truncateText(suggestion.title, 60)}
                        </p>
                        <p className="text-xs text-neutral-mid">
                          {formatAuthors(suggestion.authors)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
                <li className="border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="w-full px-4 py-2 text-sm text-primary hover:bg-gray-50 text-center font-medium"
                  >
                    See all results for "{debouncedQuery}"
                  </button>
                </li>
              </ul>
            ) : (
              <div className="p-4 text-center text-neutral-mid">
                No results found for "{debouncedQuery}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SearchBar.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  placeholder: PropTypes.string,
};

export default SearchBar;