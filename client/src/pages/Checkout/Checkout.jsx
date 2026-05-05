import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import addressService from '../../services/addressService';
import orderService from '../../services/orderService';
import PaymentGateway from './PaymentGateway';
import CartSummary from '../../components/cart/CartSummary';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pin: '',
    label: 'Home'
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressService.getAddresses();
      setAddresses(response.data.data || []);
      if (response.data.data?.length > 0) {
        setSelectedAddress(response.data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    if (!saveAddress) {
      setSelectedAddress(newAddress);
      setShowAddressModal(false);
      return;
    }
    try {
      await addressService.addAddress(newAddress);
      toast.success('Address saved successfully');
      setShowAddressModal(false);
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedAddress) {
      toast.error('Please select or add an address');
      return;
    }
    if (step === 2) {
      handlePlaceOrder();
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price
        })),
        shippingAddress: selectedAddress || newAddress,
        paymentMethod,
        totalAmount: cartTotal
      };

      const orderResponse = await orderService.createOrder(orderData);
      const createdOrderId = orderResponse.data.data._id || orderResponse.data.order._id;

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/order-success/${createdOrderId}`);
      } else {
        setOrderId(createdOrderId);
        setStep(4); // Payment step
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const addressDisplay = selectedAddress || newAddress;

  if (cartLoading) return <div className="min-h-screen py-8 px-4">Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Checkout
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Securely complete your order in a few simple steps
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-12">
            {[1,2,3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-lg transition-all ${
                  step > s ? 'bg-primary text-white shadow-lg' :
                  step === s ? 'bg-primary/10 text-primary border-4 border-primary/30 shadow-md' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full ${
                    step > s ? 'bg-primary' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {step === 1 && (
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                  <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Shipping Address
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-6 rounded-2xl border-2 cursor-pointer hover:shadow-xl transition-all ${
                          selectedAddress?._id === address._id
                            ? 'border-primary bg-primary/5 shadow-2xl ring-4 ring-primary/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900">{address.label}</h4>
                          {address.isDefault && (
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 mb-1">{address.name}</p>
                        <p className="text-sm text-slate-600">{address.street}</p>
                        <p className="text-sm text-slate-600">{address.city}, {address.state} {address.pin}</p>
                        <p className="text-sm text-slate-500 mt-2">{address.phone}</p>
                      </div>
                    ))}
                  </div>

                  {addresses.length > 0 && (
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="w-full py-4 px-6 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-2xl text-slate-700 font-semibold hover:shadow-md hover:border-slate-400 transition-all flex items-center justify-center"
                    >
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      + Add New Address
                    </button>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                  <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 10l-4-4m0 0l-4 4m4-4v10m14-4h-1m-4 10l4-4m0 0l4 4m-4-4v10" />
                    </svg>
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-center p-6 border-2 border-slate-200 rounded-2xl hover:shadow-md hover:border-slate-300 cursor-pointer transition-all group">
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-slate-900">Razorpay</h3>
                            <p className="text-slate-600">Credit/Debit Card, UPI, Net Banking</p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-6 border-2 border-slate-200 rounded-2xl hover:shadow-md hover:border-slate-300 cursor-pointer transition-all group bg-gradient-to-br from-emerald-50 to-emerald-100">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 border-slate-300"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-slate-900">Cash on Delivery</h3>
                            <p className="text-slate-600">Pay when you receive your order</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">Order Review</h2>
                  
                  {/* Address Summary */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 mb-8">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Deliver to:
                    </h3>
                    <div>
                      <p className="font-semibold text-slate-900">{addressDisplay.name}</p>
                      <p className="text-slate-700">{addressDisplay.street}</p>
                      <p className="text-slate-700">{addressDisplay.city}, {addressDisplay.state} {addressDisplay.pin}</p>
                      <p className="text-slate-600 text-sm">Phone: {addressDisplay.phone}</p>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-4 mb-8">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                        <img src={item.image || '/images/placeholder.jpg'} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-sm text-slate-600">₹{item.price.toLocaleString()} × {item.quantity} {item.size ? `• ${item.size}` : ''}</p>
                        </div>
                        <p className="font-bold text-lg text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <p className="text-center text-slate-500 py-4">+ {cartItems.length - 3} more items</p>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-700 font-semibold">Payment Method:</span>
                      <span className="font-bold text-xl capitalize">
                        {paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}
                      </span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-emerald-800">
                      <span>Total:</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && orderId && (
                <PaymentGateway 
                  amount={Math.round(cartTotal * 100)} 
                  orderId={orderId}
                  onSuccess={() => {
                    clearCart();
                    navigate(`/order-success/${orderId}`);
                  }}
                />
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-8 lg:h-screen lg:overflow-y-auto">
              <CartSummary />
            </div>
          </div>

          {/* Navigation Buttons */}
          {step !== 1 && step !== 4 && (
            <div className="flex justify-between mt-16">
              <button
                onClick={handleBack}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:shadow-md hover:border-slate-300 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-12 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : step === 3 ? (
                  'Place Order →'
                ) : (
                  'Continue →'
                )}
              </button>
            </div>
          )}

          {/* Address Modal */}
          {showAddressModal && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddressModal(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-3xl">
                    <h3 className="text-2xl font-bold text-slate-900">Add New Address</h3>
                  </div>
                  <form onSubmit={handleNewAddressSubmit} className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="House number, street, landmark"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Pin Code</label>
                      <input
                        type="text"
                        value={newAddress.pin}
                        onChange={(e) => setNewAddress({...newAddress, pin: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        id="saveAddress"
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="h-5 w-5 text-primary focus:ring-primary border-slate-300 rounded"
                      />
                      <label htmlFor="saveAddress" className="ml-3 text-sm font-semibold text-slate-700">
                        Save this address for future orders
                      </label>
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Checkout;

