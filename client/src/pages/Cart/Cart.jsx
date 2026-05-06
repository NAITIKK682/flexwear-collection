import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';

/**
 * @file Cart.jsx
 * @description Enterprise-grade Shopping Cart view with premium UI/UX, 
 * performance optimizations, and enhanced accessibility.
 */

const Cart = () => {
  const { cartItems, cartTotal, loading } = useCart();

  // Memoize item count for performance and visual consistency
  const itemCount = useMemo(() => cartItems.length, [cartItems]);

  // Loading State - Enhanced with Skeleton-like feel and premium centering
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 md:px-8 bg-slate-50 flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
        <div className="text-lg font-medium text-slate-600 tracking-wide">
          Syncing your selection...
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 bg-slate-50 min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Title Section - Premium Typography & SEO Semantic Structure */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-gray-900 via-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
            Your Shopping Bag
          </h1>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6 shadow-sm" />
          {itemCount === 0 && (
            <p className="text-xl text-slate-500 font-medium">Curate your next look.</p>
          )}
        </header>

        {itemCount === 0 ? (
          /* Empty State - Narrative-driven Emotional Design */
          <div className="text-center py-24 px-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl max-w-3xl mx-auto transform transition-all">
            <div className="w-48 h-48 bg-slate-50 rounded-full shadow-inner mb-10 mx-auto flex items-center justify-center text-6xl group hover:scale-105 transition-transform duration-500">
              <span className="grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🛍️</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              The bag is feeling light
            </h2>
            <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
              Discover pieces designed for your lifestyle. Start adding items to bring your style to life.
            </p>
            <Link
              to="/men"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white font-bold py-5 px-12 rounded-2xl text-lg shadow-2xl hover:shadow-primary/20 transform hover:-translate-y-1.5 transition-all duration-300 active:scale-95"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          /* Cart Content - Scalable Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List - Left Column (8/12) */}
            <main className="lg:col-span-8 space-y-8">
              <section className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Review Selection
                  </h2>
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-full border border-slate-200">
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                
                <div className="p-2 md:p-8 space-y-2 max-h-[75vh] overflow-y-auto custom-scrollbar">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="group transition-all duration-300 rounded-2xl hover:bg-slate-50/50"
                    >
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Trust signals / Brand Storytelling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 text-center">
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-800">Secure Checkout</p>
                  <p className="text-xs text-slate-500">256-bit SSL Encryption</p>
                </div>
                <div className="p-4 border-x border-slate-100">
                  <p className="text-sm font-bold text-slate-800">Free Returns</p>
                  <p className="text-xs text-slate-500">30-day style guarantee</p>
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-800">Fast Shipping</p>
                  <p className="text-xs text-slate-500">Global premium delivery</p>
                </div>
              </div>
            </main>

            {/* Cart Summary - Right Column (4/12) */}
            <aside className="lg:col-span-4 sticky top-8">
              <div className="transform transition-all duration-500">
                <CartSummary cartTotal={cartTotal} />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;