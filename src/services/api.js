import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong';
    
    // Show toast notification for errors
    // This would be replaced with your actual toast implementation
    console.error(`API Error: ${message}`);
    
    return Promise.reject(error);
  }
);

// Create a cancel token source
const createCancelTokenSource = () => {
  return axios.CancelToken.source();
};

// API endpoints
export const endpoints = {
  search: (query, limit = 10, cancelToken) => 
    api.get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`, { cancelToken }),
  
  getBook: (bookId, cancelToken) => 
    api.get(`/book/${bookId}`, { cancelToken }),
  
  getPriceHistory: (bookId, days = 90, cancelToken) => 
    api.get(`/price-history?book_id=${bookId}&days=${days}`, { cancelToken }),
  
  createAlert: (alertData, cancelToken) => 
    api.post('/alerts', alertData, { cancelToken }),
};

// Mock data for development without backend
export const mockData = {
  search: {
    query: "operating system concepts",
    total_results: 3,
    results: [
      {
        book_id: "ISBN:9781118063330",
        title: "Operating System Concepts",
        authors: ["Abraham Silberschatz"],
        cover: "https://covers.openlibrary.org/b/id/8601497-M.jpg",
        rating: 4.3,
        rating_count: 1245,
        offers: [
          {
            platform: "Amazon",
            platform_id: "amazon:ASIN123",
            price: 599,
            currency: "INR",
            shipping: "Free (2-3 days)",
            link: "https://amazon.in/...",
            is_prime: true,
            last_checked: "2025-09-30T10:15:00Z"
          },
          {
            platform: "Flipkart",
            platform_id: "flipkart:ITEM456",
            price: 649,
            currency: "INR",
            shipping: "₹40 (3-5 days)",
            link: "https://flipkart.com/...",
            is_prime: false,
            last_checked: "2025-09-30T09:30:00Z"
          }
        ]
      },
      {
        book_id: "ISBN:9780470128725",
        title: "Operating Systems: Internals and Design Principles",
        authors: ["William Stallings"],
        cover: "https://covers.openlibrary.org/b/id/10779397-M.jpg",
        rating: 4.1,
        rating_count: 987,
        offers: [
          {
            platform: "Amazon",
            platform_id: "amazon:ASIN789",
            price: 699,
            currency: "INR",
            shipping: "Free (2-3 days)",
            link: "https://amazon.in/...",
            is_prime: true,
            last_checked: "2025-09-30T10:15:00Z"
          }
        ]
      },
      {
        book_id: "ISBN:9781292061351",
        title: "Modern Operating Systems",
        authors: ["Andrew S. Tanenbaum"],
        cover: "https://covers.openlibrary.org/b/id/7883192-M.jpg",
        rating: 4.5,
        rating_count: 1102,
        offers: [
          {
            platform: "Amazon",
            platform_id: "amazon:ASIN456",
            price: 749,
            currency: "INR",
            shipping: "Free (2-3 days)",
            link: "https://amazon.in/...",
            is_prime: true,
            last_checked: "2025-09-30T10:15:00Z"
          }
        ]
      }
    ]
  },
  book: {
    book_id: "ISBN:9781118063330",
    title: "Operating System Concepts",
    subtitle: "Ninth Edition",
    authors: ["Abraham Silberschatz", "Peter B. Galvin", "Greg Gagne"],
    publisher: "Wiley",
    published_date: "2012-07-26",
    description: "The ninth edition of Operating System Concepts continues to evolve to provide a solid theoretical foundation for understanding operating systems...",
    page_count: 976,
    categories: ["Computers / Operating Systems / General"],
    language: "en",
    cover: "https://covers.openlibrary.org/b/id/8601497-M.jpg",
    rating: 4.3,
    rating_count: 1245,
    price_trend: [
      { date: "2025-07-01", price: 649 },
      { date: "2025-07-15", price: 629 },
      { date: "2025-08-01", price: 599 },
      { date: "2025-08-15", price: 619 },
      { date: "2025-09-01", price: 609 },
      { date: "2025-09-15", price: 599 },
      { date: "2025-09-30", price: 599 }
    ],
    offers: [
      {
        platform: "Amazon",
        platform_id: "amazon:ASIN123",
        price: 599,
        currency: "INR",
        shipping: "Free (2-3 days)",
        link: "https://amazon.in/...",
        is_prime: true,
        last_checked: "2025-09-30T10:15:00Z"
      },
      {
        platform: "Flipkart",
        platform_id: "flipkart:ITEM456",
        price: 649,
        currency: "INR",
        shipping: "₹40 (3-5 days)",
        link: "https://flipkart.com/...",
        is_prime: false,
        last_checked: "2025-09-30T09:30:00Z"
      },
      {
        platform: "Bookswagon",
        platform_id: "bookswagon:SKU789",
        price: 679,
        currency: "INR",
        shipping: "₹50 (4-6 days)",
        link: "https://bookswagon.com/...",
        is_prime: false,
        last_checked: "2025-09-30T08:45:00Z"
      }
    ],
    ai_recommendation: {
      type: "best_value",
      reason: "Amazon offers the lowest price with free and fast delivery through Prime."
    }
  }
};

// Helper to use mock data or real API based on environment
export const useMockData = () => {
  return !import.meta.env.VITE_API_BASE_URL;
};

export { api, createCancelTokenSource };
export default api;