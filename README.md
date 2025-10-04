# BookWise - Book Price Comparison Platform

BookWise is a React-based frontend application that helps users find the best deals on books across multiple online platforms. It allows users to compare prices, track price history, and set alerts for price drops.

## Features

- **Price Comparison**: Compare book prices across multiple online stores
- **Price History**: View price trends over time with interactive charts
- **Price Alerts**: Set alerts for when prices drop below a target threshold
- **AI Recommendations**: Get smart recommendations based on price, shipping, and more
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router v6
- **Charts**: Recharts for price trend visualization
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookwise.git
   cd bookwise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the API | `/api` |

Create a `.env` file in the root directory to set these variables:

```
VITE_API_BASE_URL=https://your-api-url.com
```

## Mock Mode

The application can run in mock mode, which uses predefined mock data instead of making actual API calls. This is useful for development and testing without a backend.

To run in mock mode, simply don't set the `VITE_API_BASE_URL` environment variable. The application will automatically use mock data if the API base URL is not provided.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Playwright

## Project Structure

```
bookwise/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## API Endpoints

The application uses the following API endpoints:

- `GET /api/search?q={q}&limit=10` - Search for books
- `GET /api/book/{book_id}` - Get book details
- `GET /api/price-history?book_id={book_id}&days=90` - Get price history
- `POST /api/alerts` - Create a price alert

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. Configure environment variables:
   - Add your `VITE_API_BASE_URL` in the Vercel project settings

4. Deploy the project

### Other Deployment Options

The application can be deployed to any static hosting service:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting service

## Testing

The project includes a scaffold for E2E testing with Playwright. To run the tests:

```bash
npm run test:e2e
```

Example test scenarios include:
- Search for a book
- Open product details
- Set a price alert

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)