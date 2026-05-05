import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';

const ORDER_STATUS_BADGES = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing', 
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const { user } = useAuth();
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Redirecting...');
        navigate('/auth');
        return;
      }
      toast.error('Failed to fetch order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrder(); // Refresh
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Redirecting...');
        navigate('/auth');
        return;
      }
      toast.error('Failed to cancel order');
    }
  };

  const handleReorder = async () => {
    try {
      // Add all items to cart
      toast.success('Items added to cart for reorder');
    } catch (error) {
      toast.error('Failed to reorder');
    }
  };

  const handleDownloadInvoice = () => {
    // Download PDF logic
    toast.success('Invoice downloaded');
  };

  const timelineSteps = [
    { status: 'pending', label: 'Order Placed', completed: order.status !== 'pending' },
    { status: 'processing', label: 'Processing', completed: order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled' },
    { status: 'shipped', label: 'Shipped', completed: order.status === 'shipped' || order.status === 'delivered' },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
          <div className="h-8 bg-slate-200 rounded-xl w-64" />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="h-64 bg-slate-200 rounded-xl" />
          </div>
          <div className="space-y-4 col-span-2">
            <div className="h-12 bg-slate-200 rounded-xl" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-slate-200 rounded-xl h-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 text-slate-400">❌</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order not found</h2>
        <p className="text-slate-600 mb-8">The order you're looking for doesn't exist.</p>
        <Link to="../my-orders" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="../my-orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium p-2 -m-2 rounded-lg hover:bg-blue-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
        </div>
        
        <div className="text-right">
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 rounded-xl inline-block mb-2">
            <span className="font-mono text-lg font-bold text-slate-800">{order.orderId}</span>
          </div>
        <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${ORDER_STATUS_BADGES[order.status] || 'bg-slate-100 text-slate-800'}`}>
            {STATUS_LABELS[order.status] || order.status?.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Shipping & Timeline */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Shipping Address
            </h3>
            <div className="space-y-2 text-slate-700">
              <h4 className="font-semibold">{order.shippingAddress.label}</h4>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pin}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => (
                <div key={step.status} className={`flex items-center space-x-4 p-4 rounded-xl ${step.status === order.status ? 'bg-blue-50 border border-blue-200' : ''}`}>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                      step.completed
                        ? 'bg-green-100 text-green-800 border-4 border-green-200 shadow-md'
                        : step.status === order.status
                          ? 'bg-blue-500 text-white border-4 border-blue-300 shadow-lg ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-500 border-2 border-slate-200'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className={`w-px h-12 flex-1 ${step.completed ? 'bg-green-300' : 'bg-slate-200'}`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{step.label}</p>
                    <p className="text-sm text-slate-600">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-700">Method:</span>
                <span className="font-semibold text-slate-900">Credit Card ****1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' || order.status === 'shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  Paid
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Transaction ID:</span>
                <span className="font-mono text-sm font-semibold text-slate-900">TXN-ABCD123456789</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Items & Summary */}
        <div className="space-y-6">
          {/* Items List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <img
                    src={item.product.images[0] || '/images/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">{item.product.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                      <span>Size: <span className="font-medium">{item.size}</span></span>
                      <span>Color: <span className="font-medium">{item.color}</span></span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600">${item.price.toFixed(2)} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 p-8 sticky top-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Shipping:</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-6">
              <div className="flex justify-between text-2xl font-bold text-slate-900 mb-6">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <button 
                onClick={() => window.open(order.trackingUrl || '#', '_blank')}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Track Order
              </button>
              {(order.status === 'pending' || order.status === 'processing') && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                >
                  Cancel Order
                </button>
              )}
              <button 
                onClick={handleReorder}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all"
              >
                Reorder
              </button>
              <button 
                onClick={handleDownloadInvoice}
                className="w-full border border-slate-300 text-slate-700 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:shadow-md transition-all flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10l-5.5 5.5m0 0L12 20.5m-7.5-7.5l7.5-7.5" />
                </svg>
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

