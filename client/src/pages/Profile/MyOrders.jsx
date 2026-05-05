import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import orderService from '../../services/orderService';
import { ORDER_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

const statusConfig = {
  all: { label: 'All Orders', color: 'slate' },
  pending: { label: 'Pending', color: 'yellow' },
  shipped: { label: 'Shipped', color: 'blue' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
};

const MyOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const statusFilter = searchParams.get('status') || 'all';

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await orderService.getMyOrders(params);
      setOrders(response.data.data?.orders || []);
      setTotalPages(response.data.data?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch orders');
      // Mock data
      setOrders([
        {
          _id: '1',
          orderId: '#ORD-001',
          date: '2024-07-20',
          itemsCount: 3,
          totalAmount: 249.97,
          status: 'delivered'
        },
        {
          _id: '2',
          orderId: '#ORD-002',
          date: '2024-07-18',
          itemsCount: 1,
          totalAmount: 89.99,
          status: 'shipped'
        },
        {
          _id: '3',
          orderId: '#ORD-003',
          date: '2024-07-15',
          itemsCount: 2,
          totalAmount: 156.00,
          status: 'pending'
        }
      ]);
      setTotalPages(3);
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.all;
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      slate: 'bg-slate-100 text-slate-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[config.color]}`}>
        {ORDER_STATUS?.[status] || status}
      </span>
    );
  };

  const setFilter = (newStatus) => {
    setSearchParams({ status: newStatus });
    setPage(1);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-600 mt-2">Track and manage your recent orders.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 -mx-2">
        {Object.entries(statusConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium mx-2 transition-all ${
              statusFilter === key
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:shadow-md hover:bg-slate-50'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">
            📦
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-900">
            {statusFilter === 'all' ? 'No orders yet' : `No ${statusConfig[statusFilter].label.toLowerCase()} orders`}
          </h3>
          <p className="mb-8 max-w-md mx-auto">
            {statusFilter === 'all'
              ? 'Your orders will appear here once you make a purchase.'
              : `Check back later for ${statusConfig[statusFilter].label.toLowerCase()} orders.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`orders/${order._id}`}
                className="group block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold tracking-wide">
                    {order.orderId}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-600 text-sm">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">${order.totalAmount.toFixed(2)}</div>
                  <div className="text-sm text-slate-600">({order.itemsCount} items)</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 group-hover:border-slate-300">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                    View Details
                  </span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      page === p
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:shadow-md'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MyOrders;

