import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth = ({ redirect }) => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Register
            </button>
          </nav>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {activeTab === 'login' ? (
            <LoginForm redirect={redirect} />
          ) : (
            <RegisterForm redirect={redirect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
