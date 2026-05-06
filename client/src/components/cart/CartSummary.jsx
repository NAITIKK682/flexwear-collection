import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  TicketIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/solid';

const CartSummary = ({ cartTotal }) => {
  // Logic & Constants
  const shippingThreshold = 5000;

  // ✅ Updated Logic (Under ₹150 total extra)
  const shipping = cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 49;
  const taxRate = 0.05; // 5%
  const tax = Math.min(Math.round(cartTotal * taxRate), 100);

  const total = cartTotal + shipping + tax;

  // Progress for free shipping
  const progressToFreeShipping = useMemo(() => {
    return Math.min((cartTotal / shippingThreshold) * 100, 100);
  }, [cartTotal]);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 sticky top-8 transition-all duration-500">
      <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Order Summary</h3>
      
      {/* Free Shipping Progress */}
      {cartTotal > 0 && cartTotal < shippingThreshold && (
        <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
            <span className="text-slate-500">Free Shipping Goal</span>
            <span className="text-primary">
              ₹{(shippingThreshold - cartTotal).toLocaleString()} left
            </span>
          </div>

          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <TruckIcon className="h-3 w-3" />
            Add more to unlock complimentary delivery
          </p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-5 mb-8">
        <div className="flex justify-between text-slate-600 font-medium">
          <span>Subtotal</span>
          <span className="text-slate-900 font-bold">
            ₹{cartTotal.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span className="flex items-center gap-2">
            Shipping
            {shipping === 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
                Free
              </span>
            )}
          </span>

          <span className={shipping === 0 ? "text-emerald-600 font-bold" : "text-slate-900 font-bold"}>
            ₹{shipping}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            Estimated GST
            <span className="text-[10px] text-slate-400 font-bold">(5%)</span>
          </span>
          <span className="text-slate-900 font-bold">
            ₹{tax}
          </span>
        </div>

        {/* Total */}
        <div className="pt-5 border-t border-slate-100">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Amount
              </p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                ₹{total.toLocaleString()}
              </p>
            </div>

            {shipping === 0 && cartTotal > 0 && (
              <div className="mb-1 animate-bounce">
                <span className="text-2xl">✨</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-8">
        <div className="relative group">
          <TicketIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary" />
          
          <input
            type="text"
            placeholder="PROMO CODE"
            className="w-full pl-12 pr-24 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none font-bold text-sm tracking-widest placeholder:text-slate-300 uppercase"
          />

          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">
            APPLY
          </button>
        </div>
      </div>

      {/* Checkout */}
      <Link
        to="/checkout"
        className="group w-full flex items-center justify-center gap-3 bg-primary text-white font-black py-5 px-8 rounded-[1.25rem] text-lg hover:-translate-y-1 transition-all"
      >
        <span>Proceed to Checkout</span>
        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Trust Signals */}
      <div className="mt-8 pt-6 border-t border-slate-50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
          SSL Encrypted • Safe Checkout
        </div>
      </div>
    </div>
  );
};

export default CartSummary;