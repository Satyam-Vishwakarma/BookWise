import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'

// Lazy-loaded components
const ProductDrawer = lazy(() => import('./components/ProductDrawer'))

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      
      <Footer />
      
      {/* Suspense for lazy-loaded components */}
      <Suspense fallback={<div className="fixed inset-0 bg-black/20 flex items-center justify-center">Loading...</div>}>
        <ProductDrawer />
      </Suspense>
    </div>
  )
}

export default App