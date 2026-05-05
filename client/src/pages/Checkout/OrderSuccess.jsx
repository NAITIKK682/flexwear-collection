import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-32 h-32 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-8 border-white">
          <CheckCircleIcon className="w-24 h-24 text-emerald-600" />
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-6 leading-tight">
          Order Placed!
        </h1>

        <p className="text-2xl font-bold text-slate-900 mb-2">Successfully confirmed</p>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        {/* Order Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-200 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center">
            Order Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
              <span className="font-semibold text-slate-700">Order ID:</span>
              <span className="font-mono bg-white px-4 py-2 rounded-xl text-emerald-700 font-bold shadow-sm">
                #{orderId?.slice(-8).toUpperCase() || 'N/A'}
              </span>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Estimated Delivery</span>
                <span className="font-bold text-xl text-indigo-700">3-5 Business Days</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">Starting from order confirmation date</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link
            to="/"
            className="flex-1 bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Continue Shopping
          </Link>
          <Link
            to="/profile/my-orders"
            className="flex-1 bg-white border-2 border-emerald-300 text-emerald-700 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-emerald-400 transition-all text-lg flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            View Order Details
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t-2 border-emerald-100">
          <p className="text-sm text-slate-500">
            Need help? Contact us at support@flexwear.com or call 1800-123-4567
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

