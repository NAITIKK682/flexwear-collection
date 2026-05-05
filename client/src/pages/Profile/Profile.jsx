import { Outlet, NavLink, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiHome, FiUser, FiMapPin, FiPackage, FiSettings, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const menuItems = [
    { to: '.', label: 'Overview', icon: FiHome },
    { to: 'personal-details', label: 'Personal Details', icon: FiUser },
    { to: 'addresses', label: 'My Addresses', icon: FiMapPin },
    { to: 'my-orders', label: 'My Orders', icon: FiPackage },
    { to: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen py-8 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || '/images/placeholder.jpg'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h3 className="font-semibold text-slate-900">{user?.name || 'User'}</h3>
                  <p className="text-sm text-slate-500">{user?.email || 'email@example.com'}</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
<item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 pt-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FiLogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
<Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

