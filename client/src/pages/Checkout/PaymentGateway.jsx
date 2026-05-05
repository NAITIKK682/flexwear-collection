import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentGateway = ({ amount, orderId, onSuccess }) => {
  const razorpayRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadRazorpay();
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      initPayment();
    };
    script.onerror = () => {
      toast.error('Failed to load payment gateway');
    };
    document.body.appendChild(script);
  };

  const initPayment = async () => {
    try {
      // Create Razorpay order on backend
      const response = await paymentService.createRazorpayOrder(amount, orderId);
      const razorpayOrderId = response.data.orderId || response.data.id;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_4G7O8g9r7m5jK3', // Replace with actual key
        amount: amount, // in paise
        currency: 'INR',
        name: 'FlexWear',
        description: `Payment for Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });
            
            if (verifyResponse.data.success) {
              toast.success('Payment successful! Redirecting...');
              if (onSuccess) onSuccess();
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: 'Customer Name', // Can be dynamic
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6366f1' // Primary color
        },
        modal: {
          ondismiss: function() {
            toast('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initialize payment');
      console.error('Payment init error:', error);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 10l-4-4m0 0l-4 4m4-4v10m14-4h-1m-4 10l4-4m0 0l4 4m-4-4v10" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Secure Payment</h2>
      <p className="text-xl text-slate-600 mb-8">Redirecting to Razorpay...</p>
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      <p className="text-sm text-slate-500 mt-8">Please do not refresh or close this page</p>
    </div>
  );
};

export default PaymentGateway;

