import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { endpoints, createCancelTokenSource, mockData, useMockData } from '../services/api';

/**
 * Hook for fetching book details with React Query
 * @param {string} bookId - The book ID to fetch
 * @param {object} options - Additional React Query options
 * @returns {object} React Query result object
 */
export const useBookDetail = (bookId, options = {}) => {
  const cancelTokenRef = useRef(null);
  const isMockMode = useMockData();

  // Clean up previous request on unmount or bookId change
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Request canceled due to new book selection');
      }
    };
  }, [bookId]);

  return useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      // Cancel previous request if exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Request canceled due to new book selection');
      }

      // Create new cancel token
      cancelTokenRef.current = createCancelTokenSource();

      // Use mock data in development if no API URL is provided
      if (isMockMode) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Return mock data for the requested book
        if (bookId === mockData.book.book_id) {
          return mockData.book;
        }
        
        // If book ID doesn't match mock data, find it in search results
        const bookFromSearch = mockData.search.results.find(book => book.book_id === bookId);
        
        if (bookFromSearch) {
          // Create a mock detailed book from search result
          return {
            ...bookFromSearch,
            subtitle: '',
            publisher: 'Unknown Publisher',
            published_date: '2025-01-01',
            description: 'No detailed description available.',
            page_count: 0,
            categories: [],
            language: 'en',
            price_trend: [
              { date: '2025-07-01', price: bookFromSearch.offers[0]?.price || 0 },
              { date: '2025-09-30', price: bookFromSearch.offers[0]?.price || 0 },
            ],
            ai_recommendation: {
              type: 'best_value',
              reason: 'Limited data available for this book.'
            }
          };
        }
        
        throw new Error('Book not found');
      }

      // Make the actual API request
      const response = await endpoints.getBook(
        bookId, 
        cancelTokenRef.current.token
      );
      
      return response.data;
    },
    enabled: !!bookId, // Only run query if bookId is provided
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
};

/**
 * Hook for fetching book price history with React Query
 * @param {string} bookId - The book ID to fetch price history for
 * @param {number} days - Number of days of history to fetch
 * @param {object} options - Additional React Query options
 * @returns {object} React Query result object
 */
export const usePriceHistory = (bookId, days = 90, options = {}) => {
  const cancelTokenRef = useRef(null);
  const isMockMode = useMockData();

  // Clean up previous request on unmount or parameter change
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Request canceled');
      }
    };
  }, [bookId, days]);

  return useQuery({
    queryKey: ['priceHistory', bookId, days],
    queryFn: async () => {
      // Cancel previous request if exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Request canceled');
      }

      // Create new cancel token
      cancelTokenRef.current = createCancelTokenSource();

      // Use mock data in development if no API URL is provided
      if (isMockMode) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Return mock price history data
        if (bookId === mockData.book.book_id) {
          return mockData.book.price_trend;
        }
        
        // Generate random price history for other books
        const startPrice = Math.floor(Math.random() * 500) + 500; // Random price between 500-1000
        const priceHistory = [];
        const today = new Date();
        
        for (let i = 0; i < 6; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - (i * 15)); // Every 15 days
          
          // Random price fluctuation within 10%
          const fluctuation = Math.random() * 0.2 - 0.1; // -10% to +10%
          const price = Math.round(startPrice * (1 + fluctuation));
          
          priceHistory.unshift({
            date: date.toISOString().split('T')[0],
            price
          });
        }
        
        return priceHistory;
      }

      // Make the actual API request
      const response = await endpoints.getPriceHistory(
        bookId, 
        days, 
        cancelTokenRef.current.token
      );
      
      return response.data;
    },
    enabled: !!bookId, // Only run query if bookId is provided
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
};

export default useBookDetail;