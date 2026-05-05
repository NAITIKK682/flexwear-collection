import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MinusCircleIcon, 
  PlusCircleIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (change) => {
    const newQty = Math.max(1, item.quantity + change);
    updateQuantity(item.id, newQty);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
        {/* Product Image */}
        <Link to={`/product/${item.productId}`} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
          <img
            src={item.image || '/assets/images/placeholder.jpg'}
            alt={item.name}
            className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link to={`/product/${item.productId}`} className="block">
            <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-3">
              {item.name}
            </h3>
          </Link>
          
          {/* Size & Color Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.size && (
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full shadow-sm">
                Size: {item.size}
              </span>
            )}
            {item.color && (
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full shadow-sm">
                {item.color}
              </span>
            )}
          </div>

          {/* Price & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
            {/* Item Total */}
            <div className="text-2xl lg:text-3xl font-black text-primary drop-shadow-sm">
              ₹{(item.price * item.quantity).toLocaleString()}
            </div>
            
            {/* Quantity & Unit Price */}
            <div className="flex flex-col sm:flex-row gap-4 items-end justify-between lg:justify-end lg:gap-6">
              <span className="text-lg font-semibold text-gray-700 hidden sm:inline">
                {item.price.toLocaleString()} × {item.quantity}
              </span>
              
              {/* Enhanced Quantity Controls */}
              <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1 shadow-inner hover:shadow-md transition-all duration-200">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.quantity <= 1}
                  className="group/btn p-2.5 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex-shrink-0"
                  title="Decrease quantity"
                >
                  <MinusCircleIcon className="h-5 w-5 text-gray-600 group-hover/btn:text-primary transition-colors" />
                </button>
                
                <span className="px-5 py-2.5 font-bold text-xl text-gray-900 bg-white rounded-lg shadow-sm min-w-[3rem] text-center border">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="group/btn p-2.5 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200 flex-shrink-0"
                  title="Increase quantity"
                >
                  <PlusCircleIcon className="h-5 w-5 text-gray-600 group-hover/btn:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Remove Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="group/remove flex-shrink-0 p-3 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-red-200"
          title="Remove item"
        >
          <TrashIcon className="h-6 w-6 group-hover/remove:scale-110 transition-transform" />
        </button>
      </div>

      {/* Mobile Unit Price */}
      <div className="lg:hidden mt-3 pt-3 border-t border-gray-100 text-sm font-semibold text-gray-700">
        ₹{item.price.toLocaleString()} × {item.quantity}
      </div>
    </div>
  );
};

export default CartItem;

