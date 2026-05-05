import React from 'react';
import { Link } from 'react-router-dom';

const CartSummary = ({ cartTotal }) => {
  const shipping = 0; // Free shipping
  const tax = 0; // No tax for now
  const total = cartTotal + shipping + tax;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
      
      {/* Price Breakdown */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-lg">
          <span>Subtotal</span>
          <span>₹{cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg text-green-600 font-semibold">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Tax</span>
          <span>₹0</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-2xl font-bold text-primary">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Promo Code (Optional) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promo Code (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <button className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors whitespace-nowrap">
            Apply
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="w-full block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl text-lg text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
      >
        Proceed to Checkout
      </Link>

      {/* Secure Badges */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          🔒 Secure Checkout
        </div>
        <div className="w-px h-4 bg-gray-300" />
        <div className="flex items-center gap-1">
          💳 All Cards Accepted
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

