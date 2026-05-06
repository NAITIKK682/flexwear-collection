import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { addressService } from "../../services/addressService";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";
import { toast } from 'react-hot-toast';

const CHECKOUT_STEPS = {
  ADDRESS: 1,
  PAYMENT_METHOD: 2,
  REVIEW: 3
};

// Icons
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconCreditCard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const IconShoppingBag = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.ADDRESS);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // Backend keys: 'pin' instead of pincode, 'label' instead of type
  const [newAddress, setNewAddress] = useState({
    name: '', 
    phone: '', 
    street: '', 
    city: '', 
    state: '', 
    pin: '', 
    label: 'Home' 
  });

  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      const timer = setTimeout(() => {
        if (!cart?.items?.length) navigate('/cart');
      }, 500);
      return () => clearTimeout(timer);
    }
    fetchAddresses();
  }, [cart, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressService.getAddresses();
      const addressData = res.data?.data || [];
      setAddresses(addressData);
      if (addressData.length > 0) setSelectedAddress(addressData[0]);
    } catch (error) {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CRITICAL FIX: Error handling to prevent white screen crash
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addressService.addAddress(newAddress);
      toast.success("Address added successfully");
      setShowAddressModal(false);
      setNewAddress({ name: '', phone: '', street: '', city: '', state: '', pin: '', label: 'Home' });
      fetchAddresses();
    } catch (error) {
      console.error("Add Address Error:", error.response?.data);
      const errData = error.response?.data;
      
      // Prevent rendering objects as React children
      if (errData?.errors && Array.isArray(errData.errors)) {
        toast.error(errData.errors[0].msg);
      } else {
        toast.error(errData?.message || "Something went wrong. Check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error("Please select an address");
    try {
      setLoading(true);
      const orderData = {
        items: cart.items, 
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod === 'online' ? 'razorpay' : 'cod'
      };
      const orderRes = await orderService.createOrder(orderData);
      const order = orderRes.data.order;

      if (paymentMethod === 'online') {
        await paymentService.processRazorpayPayment(order.totalAmount, order._id, () => {
          clearCart();
          navigate(`/order-success/${order._id}`);
        });
      } else {
        clearCart();
        navigate(`/order-success/${order._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Order placement failed";
      toast.error(typeof msg === 'string' ? msg : "Order Error");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items) return <div className="p-20 text-center font-bold text-indigo-600">Loading Checkout...</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center border border-slate-200">
            {Object.entries(CHECKOUT_STEPS).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= value ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > value ? <IconCheck /> : value}
                </div>
                <span className={`text-[10px] mt-2 font-black uppercase ${currentStep >= value ? 'text-indigo-600' : 'text-slate-400'}`}>{key}</span>
              </div>
            ))}
          </div>

          {currentStep === CHECKOUT_STEPS.ADDRESS && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><IconMapPin /> Delivery Address</h2>
                <button onClick={() => setShowAddressModal(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100 transition-all">
                  <IconPlus /> Add New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <div key={addr._id} onClick={() => setSelectedAddress(addr)} className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                      <div className="flex justify-between items-start">
                        <span className="font-black text-slate-800">{addr.name}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-200 rounded">{addr.label}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{addr.street}, {addr.city}</p>
                      <p className="text-sm font-bold text-slate-900 mt-3">{addr.pin}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-400 font-bold">No saved addresses found.</p>
                  </div>
                )}
              </div>

              <button disabled={!selectedAddress} onClick={() => setCurrentStep(CHECKOUT_STEPS.PAYMENT_METHOD)} className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50">
                Proceed to Payment
              </button>
            </div>
          )}

          {currentStep === CHECKOUT_STEPS.PAYMENT_METHOD && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
               <h2 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-3"><IconCreditCard /> Payment Method</h2>
               <div className="space-y-4">
                  {['online', 'cod'].map((method) => (
                    <label key={method} className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === method ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}>
                      <input type="radio" className="mr-4 accent-indigo-600 w-5 h-5" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                      <span className="capitalize font-black text-slate-800 text-lg">{method === 'online' ? 'Pay Online' : 'Cash on Delivery'}</span>
                    </label>
                  ))}
               </div>
               <div className="flex gap-4 mt-10">
                  <button onClick={() => setCurrentStep(CHECKOUT_STEPS.ADDRESS)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black">Go Back</button>
                  <button onClick={() => setCurrentStep(CHECKOUT_STEPS.REVIEW)} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100">Review Summary</button>
               </div>
            </div>
          )}

          {currentStep === CHECKOUT_STEPS.REVIEW && (
             <div className="bg-white p-8 rounded-3xl border border-slate-200">
               <h2 className="text-2xl font-black mb-6 text-slate-800 flex items-center gap-3"><IconShoppingBag /> Final Review</h2>
               <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Delivery To:</p>
                  <p className="font-black text-slate-800 text-xl">{selectedAddress?.name}</p>
                  <p className="text-slate-600">{selectedAddress?.street}, {selectedAddress?.city}</p>
               </div>
               <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
                  {loading ? 'Processing...' : 'Confirm Order'}
               </button>
             </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-8">
            <h3 className="text-xl font-black text-slate-800 mb-6 pb-4 border-b border-slate-100">Summary</h3>
            <div className="space-y-4 mb-8">
              {cart.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-500">{item.productId?.name} x {item.quantity}</span>
                  <span className="text-slate-900">₹{(item.productId?.discountedPrice || 0) * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-dashed border-slate-200 pt-6">
              <div className="flex justify-between text-2xl font-black text-slate-900">
                <span>Total</span>
                <span className="text-indigo-600">₹{getCartTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddressModal(false)} />
          <div className="relative bg-[#F5F5DC] w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-[#b91c1c] animate-in zoom-in-95 duration-300">
            <div className="bg-[#b91c1c] p-8 text-white flex justify-between items-center">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Add Address</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-white text-3xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleAddAddress} className="p-8 space-y-5">
              <input required type="text" placeholder="Full Name" className="w-full bg-white border-2 border-[#fca5a5] rounded-2xl px-6 py-4 outline-none font-bold text-slate-800" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-5">
                <input required type="tel" placeholder="Phone" className="w-full bg-white border-2 border-[#fca5a5] rounded-2xl px-6 py-4 outline-none font-bold text-slate-800" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                <select className="w-full bg-white border-2 border-[#fca5a5] rounded-2xl px-6 py-4 outline-none font-black text-slate-800" value={newAddress.label} onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                </select>
              </div>
              <input required type="text" placeholder="Street/Building" className="w-full bg-white border-2 border-[#fca5a5] rounded-2xl px-6 py-4 outline-none font-bold text-slate-800" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} />
              <div className="grid grid-cols-2 gap-5">
                <input required type="text" placeholder="City" className="w-full bg-white border-2 border-[#fca5a5] rounded-2xl px-6 py-4 outline-none font-bold text-slate-800" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                <input required type="text" placeholder="Pincode" className="w-full bg-white border-2 border-[#fca5a5] rounded-2xl px-6 py-4 outline-none font-bold text-slate-800" value={newAddress.pin} onChange={(e) => setNewAddress({...newAddress, pin: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 bg-white text-[#b91c1c] py-4 rounded-2xl font-black border-2 border-[#b91c1c]">DISCARD</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-[#b91c1c] text-white py-4 rounded-2xl font-black">SAVE ADDRESS</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;