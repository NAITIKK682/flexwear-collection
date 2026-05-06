import ProductCard from './ProductCard'

const ProductGrid = ({ products, loading }) => {
  const skeletonCards = [...Array(8)].map((_, i) => (
    <div key={i} className="animate-pulse bg-slate-100 rounded-2xl p-4 sm:p-6 h-80 sm:h-96">
      <div className="w-full h-48 sm:h-64 bg-slate-200 rounded-xl mb-4"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  ))

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
      role="grid"
      aria-live="polite"
      aria-busy={loading}
    >
      {loading ? (
        skeletonCards
      ) : products.length === 0 ? (
        <div className="col-span-full text-center py-12 sm:py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 mx-auto">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Try adjusting your filters or check back later.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      )}
    </div>
  )
}

export default ProductGrid