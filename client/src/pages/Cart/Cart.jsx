import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
// No import needed, use direct path

const Cart = () => {
  const { cartItems, cartTotal, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 md:px-8 bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Shopping Cart
          </h1>
          {cartItems.length === 0 && (
            <p className="text-xl text-gray-600">No items in your cart</p>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-64 h-64 bg-gray-200 rounded-3xl shadow-2xl mb-8 opacity-50 mx-auto flex items-center justify-center text-4xl">
              🛒
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/men"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <section className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Items ({cartItems.length})
                </h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </section>

            {/* Cart Summary - Right Column */}
            <aside className="lg:col-span-1">
              <CartSummary cartTotal={cartTotal} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

