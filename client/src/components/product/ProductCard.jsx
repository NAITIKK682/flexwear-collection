import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discountedPercent = product.price && product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const avgRating = product.reviews?.length > 0 
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border hover:border-primary/50">
      {/* Image & Badges */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <Link to={`/product/${product._id}`}>
          <img 
            src={product.images?.[0] || '/assets/images/placeholder.jpg'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        {product.featured && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
            Featured
          </span>
        )}
        {discountedPercent > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            -{discountedPercent}%
          </span>
        )}
        {/* Quick View & Add to Cart Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-all">
              Quick View
            </button>
            <button 
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">({product.reviews?.length || 0})</span>
        </div>
        
        {/* Price */}
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
  );
};

export default ProductCard;
