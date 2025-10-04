import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { endpoints, createCancelTokenSource, mockData, useMockData } from '../services/api';

/**
 * Hook for searching books with React Query
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results to return
 * @param {object} options - Additional React Query options
 * @returns {object} React Query result object
 */
export const useSearch = (query, limit = 10, options = {}) => {
  const cancelTokenRef = useRef(null);
  const isMockMode = useMockData();

  // Clean up previous request on unmount or query change
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Request canceled due to new search');
      }
    };
  }, [query]);

  return useQuery({
    queryKey: ['search', query, limit],
    queryFn: async () => {
      // Cancel previous request if exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Request canceled due to new search');
      }

      // Create new cancel token
      cancelTokenRef.current = createCancelTokenSource();

      // Use mock data in development if no API URL is provided
      if (isMockMode) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter mock data based on query
        if (!query) return { query: '', total_results: 0, results: [] };
        
        const filteredResults = mockData.search.results.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) || 
          book.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
        );
        
        return {
          query,
          total_results: filteredResults.length,
          results: filteredResults.slice(0, limit)
        };
      }

      // Make the actual API request
      const response = await endpoints.search(
        query, 
        limit, 
        cancelTokenRef.current.token
      );
      
      return response.data;
    },
    enabled: !!query && query.length > 1, // Only run query if search term is provided and at least 2 chars
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Hook for auto-suggest search with debounce
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results to return
 * @returns {object} React Query result object
 */
export const useSearchSuggestions = (query, limit = 5) => {
  return useSearch(query, limit, {
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export default useSearch;