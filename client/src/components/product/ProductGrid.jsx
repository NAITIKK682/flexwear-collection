import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
  const skeletonCards = [...Array(8)].map((_, i) => (
    <div key={i} className="animate-pulse bg-gray-100 rounded-2xl p-6 h-96">
      <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  ));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        skeletonCards
      ) : products.length === 0 ? (
        <div className="col-span-full text-center py-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
          <p className="text-gray-600 mb-8">Try adjusting your filters or check back later.</p>
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
            Clear Filters
          </button>
        </div>
      ) : (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      )}
    </div>
  );
};

export default ProductGrid;
