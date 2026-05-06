import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import productService from '../../services/productService'
import ProductFilter from '../../components/product/ProductFilter'
import ProductGrid from '../../components/product/ProductGrid'
import toast from 'react-hot-toast'

// ─── Category metadata for better UX ─────────────────────────────────────────
const CATEGORY_META = {
  men: {
    title: 'Men',
    description: 'Explore our curated collection of modern menswear.',
    image: '/images/categories/men.jpg'
  },
  women: {
    title: 'Women',
    description: 'Discover stylish essentials for every occasion.',
    image: '/images/categories/women.jpg'
  },
  kids: {
    title: 'Kids',
    description: 'Comfortable and fun fashion for little ones.',
    image: '/images/categories/kids.jpg'
  },
  accessories: {
    title: 'Accessories',
    description: 'Complete your look with our premium accessories.',
    image: '/images/categories/accessories.jpg'
  }
}

const Shop = ({ category: propCategory }) => {
  const { category: paramCategory } = useParams()
  const category = propCategory || paramCategory
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    sortBy: 'newest'
  })

  // ─── Memoized category data ────────────────────────────────────────────────
  const categoryData = useMemo(() => {
    return CATEGORY_META[category?.toLowerCase()] || {
      title: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products',
      description: 'Browse our latest collection.',
      image: null
    }
  }, [category])

  // ─── Fetch products with filters ───────────────────────────────────────────
  const fetchProducts = useCallback(async (filterOverrides = {}) => {
    try {
      setLoading(true)
      const params = {
        category,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sizes: filters.sizes.join(','),
        colors: filters.colors.join(','),
        sort: filters.sortBy === 'newest' ? '-createdAt' : 
              filters.sortBy === 'price-asc' ? 'discountedPrice' :
              filters.sortBy === 'price-desc' ? '-discountedPrice' : '-rating',
        limit: 20,
        ...filterOverrides
      }
      
      const response = await productService.getAllProducts(params)
      setProducts(response.data?.data || response.data?.products || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, filters])

  // ─── Refetch when category or filters change ───────────────────────────────
  useEffect(() => {
    if (category) {
      fetchProducts()
    }
  }, [fetchProducts, category])

  // ─── Handle filter updates ─────────────────────────────────────────────────
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  // ─── Simple loading skeleton ───────────────────────────────────────────────
  const LoadingSkeleton = () => (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-8 bg-slate-200 rounded animate-pulse w-3/4" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    </div>
  )

  // ─── Empty state ───────────────────────────────────────────────────────────
  const EmptyState = () => (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
      <p className="text-slate-500 mb-6">Try adjusting your filters or check back later for new arrivals.</p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="flex mb-4 sm:mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-indigo-600 transition-colors duration-200">Home</Link>
            </li>
            <li>
              <span className="px-2 text-slate-300">/</span>
            </li>
            <li className="font-medium text-slate-900 capitalize" aria-current="page">
              {categoryData.title}
            </li>
          </ol>
        </nav>

        {/* ─── Category Header ────────────────────────────────────────────── */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 capitalize mb-2">
            {categoryData.title}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
            {categoryData.description}
          </p>
        </div>

        {/* ─── Main Content Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* ─── Sidebar Filter (hidden on mobile, toggleable) ───────────── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <ProductFilter 
                onFilterChange={handleFilterChange} 
                filters={filters}
                category={category}
              />
            </div>
          </div>
          
          {/* ─── Products Area ───────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSkeleton />
            ) : products.length === 0 ? (
              <EmptyState />
            ) : (
              <ProductGrid 
                products={products} 
                loading={loading}
                category={category}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop