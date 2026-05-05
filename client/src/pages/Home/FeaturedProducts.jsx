import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts({ 
          limit: 8, 
          featured: true,
          sort: '-createdAt' 
        });
        setProducts(response.data?.data || response.data?.products || []);
        setError(null);
      } catch (err) {
        const message = err?.response?.data?.message || 'Failed to load featured products';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-80">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  if (loading) return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {renderSkeleton()}
      </div>
    </section>
  );

  const safeProducts = Array.isArray(products) ? products : [];
  const featuredProducts = safeProducts.slice(0, 8);

  if (error || featuredProducts.length === 0) return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-gray-500 text-xl mb-8">
          {error ? 'Failed to load products' : 'No featured products available yet'}
        </div>
        <button 
          type="button"
          onClick={() => window.location.reload()} 
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          {error ? 'Retry' : 'Refresh'}
        </button>
      </div>
    </section>
  );

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link 
              key={product._id} 
              to={`/product/${product._id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border hover:border-gray-200">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.images?.[0] || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.discountedPrice && product.price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {product.discountedPrice ? (
                      <>
                        <span className="text-2xl font-bold text-primary">
                          ₹{product.discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
