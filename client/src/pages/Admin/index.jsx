import { useSearchParams, Link } from 'react-router-dom';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';

const navItems = [
  { tab: 'dashboard', label: 'Dashboard', icon: '📊' },
  { tab: 'products', label: 'Products', icon: '📦' },
  { tab: 'orders', label: 'Orders', icon: '📋' },
  { tab: 'users', label: 'Users', icon: '👥' },
];

const getPageComponent = (tab) => {
  switch (tab) {
    case 'dashboard':
      return <AdminDashboard />;
case 'products':
      return <ProductManagement />;
case 'orders':
      return <OrderManagement />;
case 'users':
      return <UserManagement />;
    default:
      return (
        <div className="p-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to Admin Panel</h2>
          <p className="text-slate-600">Select a section from the sidebar to get started.</p>
        </div>
      );
  }
};

export default function Admin() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        {/* Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-slate-200/50 p-8 flex flex-col sticky top-0 h-screen">
          <div className="mb-12">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2 tracking-tight">
              FlexWear
            </h2>
            <h3 className="text-xl font-bold text-slate-700 mb-1">Admin Panel</h3>
            <p className="text-sm text-slate-500">Complete store management</p>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.tab}
                to={`/admin?tab=${item.tab}`}
                className={`group flex items-center p-4 rounded-2xl transition-all duration-300 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:scale-[1.02] ${
                  tab === item.tab
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent shadow-blue-500/25 scale-[1.02] rotate-1'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-slate-200/50'
                }`}
              >
                <span className="mr-4 text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-medium text-lg">{item.label}</span>
                {tab === item.tab && (
                  <div className="ml-auto w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-12 max-w-7xl mx-auto">
            <header className="mb-12">
              <h1 className="text-4xl font-black text-slate-900 capitalize mb-3 tracking-tight">
                {navItems.find(i => i.tab === tab)?.label || 'Dashboard'} Overview
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                Manage your {tab} effectively with powerful tools and real-time insights
              </p>
            </header>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 min-h-[70vh]">
              {getPageComponent(tab)}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

