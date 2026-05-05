import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

// Heroicons SVGs (Tailwind compatible)
const UserIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShoppingBagIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const Bars3Icon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeAll = () => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAll();
  };

  return (
    <>
      <nav className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900" onClick={closeAll}>
                FLEXWEAR
              </Link>
            </div>

            {/* Center: Desktop NavLinks */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/men"
                className={({ isActive }) =>
                  `uppercase font-semibold text-sm hover:text-primary transition-colors ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-gray-700'
                  }`
                }
                onClick={closeAll}
              >
                Men
              </NavLink>
              <NavLink
                to="/women"
                className={({ isActive }) =>
                  `uppercase font-semibold text-sm hover:text-primary transition-colors ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-gray-700'
                  }`
                }
                onClick={closeAll}
              >
                Women
              </NavLink>
              <NavLink
                to="/kids"
                className={({ isActive }) =>
                  `uppercase font-semibold text-sm hover:text-primary transition-colors ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-gray-700'
                  }`
                }
                onClick={closeAll}
              >
                Kids
              </NavLink>
              <NavLink
                to="/accessories"
                className={({ isActive }) =>
                  `uppercase font-semibold text-sm hover:text-primary transition-colors ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-gray-700'
                  }`
                }
                onClick={closeAll}
              >
                Accessories
              </NavLink>
            </div>

            {/* Right: Auth/Cart */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary" onClick={closeAll}>
                <ShoppingBagIcon />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary rounded-full"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <UserIcon />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">{user?.name || 'User'}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeAll}>
                        My Profile
                      </Link>
                      <Link to="/profile/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeAll}>
                        My Orders
                      </Link>
                      <Link to="/profile/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeAll}>
                        Addresses
                      </Link>
                      <Link to="/profile/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeAll}>
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="p-2 text-gray-700 hover:text-primary" onClick={closeAll}>
                  <UserIcon />
                </Link>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden" ref={mobileRef}>
                <button onClick={toggleMobile} className="p-2 text-gray-700 hover:text-primary">
                  {isMobileOpen ? <XMarkIcon /> : <Bars3Icon />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-w-7xl mx-auto">
              <NavLink
                to="/men"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`
                }
                onClick={toggleMobile}
              >
                Men
              </NavLink>
              <NavLink
                to="/women"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`
                }
                onClick={toggleMobile}
              >
                Women
              </NavLink>
              <NavLink
                to="/kids"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`
                }
                onClick={toggleMobile}
              >
                Kids
              </NavLink>
              <NavLink
                to="/accessories"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`
                }
                onClick={toggleMobile}
              >
                Accessories
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

