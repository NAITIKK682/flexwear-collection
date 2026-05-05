import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiArrowRight } from 'react-icons/fi';
import orderService from '../../services/orderService';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Overview = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await orderService.getMyOrders({ limit: 5 });
        setRecentOrders(response.data.data || []);
      } catch (error) {
        toast.error('Failed to fetch recent orders');
        // Mock data fallback
        setRecentOrders([
          { _id: '1', orderId: '#ORD-123', date: '2024-01-15', items: 2, total: 89.99, status: 'delivered' },
          { _id: '2', orderId: '#ORD-122', date: '2024-01-10', items: 1, total: 45.00, status: 'shipped' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  const stats = [
    { label: 'Total Orders', value: '12', change: '+2' },
    { label: 'Total Spent', value: '$1,234', change: '+15%' },
    { label: 'Wishlist Items', value: '5', change: '0' },
    { label: 'Account Age', value: '3 months', change: '' },
  ];

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 rounded w-48"></div></div>;
  }

  return (
    <>
      <div className="border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
        <p className="text-slate-600 mt-2">Here's what's happening with your account.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <dt className="text-sm font-medium text-slate-600 mb-1">{stat.label}</dt>
            <dd className="text-2xl font-bold text-slate-900">{stat.value}</dd>
            {stat.change && (
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Orders</h2>
            <Link to="my-orders" className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm">
              View All <FiArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                📦
              </div>
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p>Start shopping to see your recent orders here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <Link
                  key={order._id}
                  to={`orders/${order._id}`}
                  className="group block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                      {order.orderId}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                    <span>{order.date}</span>
                    <span>{order.items} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">${order.total}</span>
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      View Details <FiArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="my-orders"
              className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors mr-4">
                📋
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">View All Orders</h3>
                <p className="text-sm text-slate-600">Track and manage orders</p>
              </div>
            </Link>
            <Link
              to="personal-details"
              className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors mr-4">
                ✏️
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-green-700">Edit Profile</h3>
                <p className="text-sm text-slate-600">Update your information</p>
              </div>
            </Link>
            <Link
              to="addresses"
              className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors mr-4">
                📍
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-purple-700">Manage Addresses</h3>
                <p className="text-sm text-slate-600">Add or edit shipping addresses</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;

