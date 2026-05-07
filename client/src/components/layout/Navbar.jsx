import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

// ─── Icons (memoized for performance) ────────────────────────────────────────
const UserIcon = memo(({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
))
UserIcon.displayName = 'UserIcon'

const ShoppingBagIcon = memo(({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
))
ShoppingBagIcon.displayName = 'ShoppingBagIcon'

const Bars3Icon = memo(({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
))
Bars3Icon.displayName = 'Bars3Icon'

const XMarkIcon = memo(({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
))
XMarkIcon.displayName = 'XMarkIcon'

const ChevronDownIcon = memo(({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
))
ChevronDownIcon.displayName = 'ChevronDownIcon'

// ─── Nav links config ─────────────────────────────────────────────────────────
const NAV_LINKS = Object.freeze([
  { to: '/men',        label: 'Men' },
  { to: '/women',      label: 'Women' },
  { to: '/kids',       label: 'Kids' },
  { to: '/accessories',label: 'Accessories' },
])

// ─── Dropdown menu items ──────────────────────────────────────────────────────
const ACCOUNT_MENU_ITEMS = [
  { to: '/profile',           label: 'My Profile' },
  { to: '/profile/orders',    label: 'My Orders' },
  { to: '/profile/addresses', label: 'Addresses' },
  { to: '/profile/settings',  label: 'Settings' },
]

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = memo(() => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAvatarLoading, setIsAvatarLoading] = useState(true)

  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  
  const dropdownRef = useRef(null)
  const mobileRef = useRef(null)
  const dropdownButtonRef = useRef(null)
  const firstDropdownItemRef = useRef(null)
  const mobileMenuFirstItemRef = useRef(null)

  // ── Scroll shadow with performance optimization ───────────────────────────
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 8)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close menus on route change ───────────────────────────────────────────
  useEffect(() => {
    setIsMobileOpen(false)
    setIsDropdownOpen(false)
    setIsAvatarLoading(true)
  }, [location.pathname])

  // ── Close on outside click with proper event handling ─────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      // FIX: Exclude hamburger toggle button from outside-click close logic
      if (mobileRef.current && !mobileRef.current.contains(event.target) && !event.target.closest('[aria-controls="mobile-menu"]')) {
        setIsMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // ── Keyboard navigation for dropdown ──────────────────────────────────────
  useEffect(() => {
    if (!isDropdownOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsDropdownOpen(false)
        dropdownButtonRef.current?.focus()
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const items = dropdownRef.current?.querySelectorAll('[role="menuitem"]')
        if (!items || items.length === 0) return
        
        const currentIndex = Array.from(items).findIndex(el => el === document.activeElement)
        let nextIndex = e.key === 'ArrowDown' 
          ? (currentIndex + 1) % items.length 
          : (currentIndex - 1 + items.length) % items.length
        
        items[nextIndex]?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDropdownOpen])

  // ── Keyboard navigation for mobile menu ───────────────────────────────────
  useEffect(() => {
    if (!isMobileOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsMobileOpen(false)
      }
      if (e.key === 'Tab') {
        // Simple focus trap for mobile menu
        const focusableElements = mobileRef.current?.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return
        
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Focus first item when mobile menu opens
    setTimeout(() => mobileMenuFirstItemRef.current?.focus(), 100)
    
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileOpen])

  // ── Lock body scroll when mobile menu is open ─────────────────────────────
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const originalPadding = document.body.style.paddingRight
    
    if (isMobileOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPadding
    }
    
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPadding
    }
  }, [isMobileOpen])

  // ── Handlers with useCallback for performance ─────────────────────────────
  const closeAll = useCallback(() => {
    setIsMobileOpen(false)
    setIsDropdownOpen(false)
  }, [])

  const toggleMobile = useCallback(() => {
    setIsMobileOpen(prev => !prev)
    setIsDropdownOpen(false)
  }, [])

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
    setIsMobileOpen(false)
  }, [])

  const handleLogout = useCallback(async () => {
    closeAll()
    await logout()
    navigate('/', { replace: true })
  }, [logout, closeAll, navigate])

  const handleAvatarLoad = useCallback(() => {
    setIsAvatarLoading(false)
  }, [])

  const handleAvatarError = useCallback(() => {
    setIsAvatarLoading(false)
  }, [])

  // ── Derived values ────────────────────────────────────────────────────────
  const displayName = user?.name?.split(' ')[0] || 'Account'
  const safeCartCount = Math.min(cartCount || 0, 99)
  const cartAriaLabel = `Shopping cart, ${safeCartCount} item${safeCartCount !== 1 ? 's' : ''}`

  return (
    <>
      {/* ── CSS Custom Properties & Keyframes ─────────────────────────────── */}
      <style>{`
        :root {
          --nav-animation-duration: 250ms;
          --nav-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
          --focus-ring-color: 79 70 229;
          --focus-ring-offset: 2px;
          --touch-target-min: 44px;
        }

        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        .nav-link-underline {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: currentColor;
          transition: width var(--nav-animation-duration) var(--nav-animation-easing);
          border-radius: 9999px;
          will-change: width;
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.active::after {
          width: 100%;
        }

        .touch-target {
          min-height: var(--touch-target-min);
          min-width: var(--touch-target-min);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .focus-ring:focus-visible {
          outline: 2px solid rgb(var(--focus-ring-color));
          outline-offset: var(--focus-ring-offset);
          border-radius: 0.5rem;
        }

        .hover-lift {
          transition: transform var(--nav-animation-duration) var(--nav-animation-easing),
                      box-shadow var(--nav-animation-duration) var(--nav-animation-easing);
          will-change: transform, box-shadow;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .button-press:active {
          animation: buttonPress 150ms var(--nav-animation-easing);
        }

        .avatar-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`
          sticky top-0 z-50 bg-white/95 backdrop-blur-sm
          transition-shadow duration-300
          ${isScrolled ? 'shadow-lg shadow-slate-200/50' : 'shadow-sm'}
        `}
        style={{ 
          animation: 'navSlideDown var(--nav-animation-duration) var(--nav-animation-easing) forwards',
          willChange: 'transform, box-shadow'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* ── Logo ───────────────────────────────────────────────────── */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                onClick={closeAll}
                aria-label="Flexwear — go to homepage"
                className="text-2xl font-black tracking-tight text-slate-900 hover:opacity-90 transition-opacity duration-200 select-none focus-ring"
              >
                FLEX<span className="text-indigo-600">WEAR</span>
              </Link>
            </div>

            {/* ── Desktop nav ───────────────────────────────────────────── */}
            <div className="hidden md:flex items-center space-x-1" role="menubar" aria-label="Primary">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  role="menuitem"
                  onClick={closeAll}
                  className={({ isActive }) =>
                    `nav-link-underline uppercase font-semibold text-sm tracking-wider px-3 py-2 rounded-lg transition-colors duration-200 focus-ring
                    ${isActive 
                      ? 'text-indigo-600 active' 
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* ── Right: Cart + Auth + Hamburger ────────────────────────── */}
            <div className="flex items-center space-x-1 sm:space-x-2">

              {/* Cart with live region announcement */}
              <Link
                to="/cart"
                onClick={closeAll}
                aria-label={cartAriaLabel}
                className="relative touch-target p-2 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 focus-ring hover-lift button-press"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                {safeCartCount > 0 && (
                  <>
                    <span
                      className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center leading-none tabular-nums ring-2 ring-white"
                      aria-hidden="true"
                    >
                      {safeCartCount}
                    </span>
                    <span className="sr-only" aria-live="polite">
                      {safeCartCount} item{safeCartCount !== 1 ? 's' : ''} in cart
                    </span>
                  </>
                )}
              </Link>

              {/* Auth Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    ref={dropdownButtonRef}
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="menu"
                    aria-label={`Account menu for ${displayName}`}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 focus-ring hover-lift button-press"
                  >
                    {user?.avatar ? (
                      <div className="relative h-7 w-7 rounded-full ring-2 ring-indigo-100 overflow-hidden">
                        {isAvatarLoading && (
                          <div className="absolute inset-0 avatar-skeleton rounded-full" aria-hidden="true" />
                        )}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`h-7 w-7 rounded-full object-cover transition-opacity duration-200 ${isAvatarLoading ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={handleAvatarLoad}
                          onError={handleAvatarError}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <span 
                        className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase select-none ring-2 ring-indigo-100"
                        aria-hidden="true"
                      >
                        {displayName[0]}
                      </span>
                    )}
                    <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      ref={firstDropdownItemRef}
                      role="menu"
                      aria-label="Account options"
                      className="absolute right-0 mt-2 w-56 max-w-[95vw] bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-1.5 z-50 overflow-hidden focus:outline-none"
                      style={{ 
                        animation: 'dropdownFade 150ms var(--nav-animation-easing) forwards',
                        willChange: 'opacity, transform'
                      }}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate" title={user?.name}>
                          {user?.name || 'User'}
                        </p>
                        {user?.email && (
                          <p className="text-xs text-slate-400 truncate" title={user.email}>
                            {user.email}
                          </p>
                        )}
                      </div>
                      {ACCOUNT_MENU_ITEMS.map(({ to, label }) => (
                        <Link
                          key={to}
                          to={to}
                          role="menuitem"
                          onClick={closeAll}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 focus-ring focus:bg-indigo-50"
                        >
                          {label}
                        </Link>
                      ))}
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          role="menuitem"
                          onClick={closeAll}
                          className="block px-4 py-2.5 text-sm text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors duration-150 border-t border-slate-100 mt-1 focus-ring focus:bg-indigo-50"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 border-t border-slate-100 mt-1 focus-ring focus:bg-red-50 button-press"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeAll}
                  aria-label="Sign in to your account"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 focus-ring hover-lift button-press touch-target"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={toggleMobile}
                aria-expanded={isMobileOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="md:hidden touch-target p-2 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 focus-ring hover-lift button-press"
              >
                {isMobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu with focus trap ────────────────────────────────── */}
        {isMobileOpen && (
          <div
            id="mobile-menu"
            ref={mobileRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="md:hidden bg-white border-t border-slate-100 shadow-lg shadow-slate-200/30 overflow-x-hidden"
            style={{ 
              animation: 'mobileSlideIn 180ms var(--nav-animation-easing) forwards',
              willChange: 'transform, opacity'
            }}
          >
            {/* FIX: Changed from max-w-7xl mx-auto to w-full px-4 for proper mobile containment */}
            <div className="w-full px-4 pt-3 pb-5 space-y-1">
              {NAV_LINKS.map(({ to, label }, index) => (
                <NavLink
                  key={to}
                  to={to}
                  role="menuitem"
                  ref={index === 0 ? mobileMenuFirstItemRef : null}
                  onClick={closeAll}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 focus-ring
                    ${isActive
                      ? 'text-indigo-700 bg-indigo-50 font-semibold'
                      : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/70'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {/* Mobile auth section */}
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 flex items-center gap-3 bg-slate-50 rounded-xl">
                      {user?.avatar ? (
                        <div className="relative h-10 w-10 rounded-full ring-2 ring-indigo-100 overflow-hidden flex-shrink-0">
                          {isAvatarLoading && (
                            <div className="absolute inset-0 avatar-skeleton rounded-full" aria-hidden="true" />
                          )}
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className={`h-10 w-10 rounded-full object-cover transition-opacity duration-200 ${isAvatarLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={handleAvatarLoad}
                            onError={handleAvatarError}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <span className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold uppercase select-none ring-2 ring-indigo-100 flex-shrink-0">
                          {displayName[0]}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    {ACCOUNT_MENU_ITEMS.slice(0, 3).map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        role="menuitem"
                        onClick={closeAll}
                        className="block px-4 py-3 rounded-xl text-sm text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors focus-ring"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors focus-ring button-press"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    role="menuitem"
                    onClick={closeAll}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors focus-ring text-center"
                  >
                    Sign in / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar