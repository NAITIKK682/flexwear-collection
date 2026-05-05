import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
  shipped: { color: 'bg-blue-100 text-blue-800', label: 'Shipped' },
  delivered: { color: 'bg-indigo-100 text-indigo-800', label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 10;
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const fetchOrders = async (page = currentPage, filterStatus = statusFilter === 'all' ? '' : statusFilter) => {
    try {
      setLoading(true);
      const params = { page, limit: itemsPerPage, status: filterStatus };
      const res = await adminService.getOrders(params);
      setOrders(res.data.data || res.data || []);
      setTotalOrders(res.data.total || 0);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const viewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      setUpdatingOrder(null);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const SkeletonRow = () => <div className="h-16 bg-slate-200 rounded-lg animate-pulse mb-2" />;

  return (
    <div>
      {/* Filter */}
      <div className="mb-8">
        <select
          className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {statusConfig[status]?.label || status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-bold mb-2">No orders found</h3>
            <p className="text-slate-600">Try changing the status filter</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-sm bg-slate-50 rounded-xl">
                        #{order._id?.slice(-8)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{order.user?.name}</div>
                        <div className="text-sm text-slate-600">{order.user?.email}</div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        {order.items?.length || 0}
                      </td>

                      <td className="px-6 py-4 font-bold text-lg text-slate-900">
                        ${order.total || 0}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusConfig[order.status]?.color}`}>
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 space-x-3">
                        <button
                          onClick={() => viewOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        >
                          👁
                        </button>

                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="px-3 py-1 border rounded-lg text-sm"
                        >
                          {Object.keys(statusConfig).map(s => (
                            <option key={s} value={s}>
                              {statusConfig[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-slate-200 bg-slate-50">
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              >
                Previous
              </button>

              <span>{currentPage}</span>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL FIXED (ONLY STRUCTURE FIX) */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Order Details</h2>
            <p>{selectedOrder._id}</p>

            <button onClick={() => setShowViewModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManagement;