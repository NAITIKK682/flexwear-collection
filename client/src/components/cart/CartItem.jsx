import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MinusCircleIcon, 
  PlusCircleIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

/**
 * @file CartItem.jsx
 * @description Enhanced production-grade cart item component with 
 * premium micro-interactions, refined typography, and responsive grid logic.
 */

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (change) => {
    const newQty = Math.max(1, item.quantity + change);
    updateQuantity(item.id, newQty);
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-slate-100 group mb-4">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        
        {/* Product Image - Enhanced with sophisticated framing */}
        <Link 
          to={`/product/${item.productId}`} 
          className="relative flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        >
          <div className="absolute inset-0 bg-slate-900/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={item.image || '/assets/images/placeholder.jpg'}
            alt={item.name}
            className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-xl shadow-sm border border-slate-50"
          />
        </Link>

        {/* Product Details - Premium Typography & Spacing */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/product/${item.productId}`} className="block max-w-[85%]">
              <h3 className="text-lg font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1 tracking-tight">
                {item.name}
              </h3>
            </Link>
            
            {/* Desktop Remove Button - Clean placement */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="hidden sm:flex group/remove p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
              aria-label="Remove item"
            >
              <TrashIcon className="h-5 w-5 transform group-hover/remove:rotate-12 transition-transform" />
            </button>
          </div>
          
          {/* Attributes - Subtler Color Palette */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.size && (
              <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md border border-slate-100">
                Size: {item.size}
              </span>
            )}
            {item.color && (
              <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md border border-slate-100">
                {item.color}
              </span>
            )}
          </div>

          {/* Pricing & Controls Grid */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</span>
              <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
                ₹{(item.price * item.quantity).toLocaleString()}
                <span className="text-xs font-medium text-slate-400 line-through decoration-slate-300">
                  ₹{((item.price * 1.2) * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Responsive Unit Price Label */}
              <div className="hidden lg:block text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Price</p>
                <p className="text-sm font-semibold text-slate-600">₹{item.price.toLocaleString()}</p>
              </div>

              {/* Enhanced Quantity Controls - Glassmorphism touch */}
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1.5 shadow-inner">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.quantity <= 1}
                  className="p-2 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all duration-200 text-slate-500 active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <MinusCircleIcon className="h-5 w-5" />
                </button>
                
                <span className="w-10 text-center font-bold text-slate-900 select-none">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-200 text-slate-500 active:scale-90"
                  aria-label="Increase quantity"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only Remove - Bottom Action Bar Style */}
        <div className="sm:hidden w-full pt-4 border-t border-slate-50 flex justify-between items-center">
           <span className="text-sm font-semibold text-slate-500">₹{item.price.toLocaleString()} per unit</span>
           <button
              onClick={() => removeFromCart(item.id)}
              className="flex items-center gap-2 px-4 py-2 text-red-500 font-bold text-sm bg-red-50 rounded-xl"
            >
              <TrashIcon className="h-4 w-4" />
              Remove
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;