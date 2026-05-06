import { Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom'
import { Suspense, lazy, useEffect, useRef, useCallback } from 'react'
import { Navbar, Footer } from './components/layout'
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/common/Loader'

// ─── Lazy-loaded pages (code splitting for performance) ──────────────────────
const Home          = lazy(() => import('./pages/Home'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart          = lazy(() => import('./pages/Cart'))
const Auth          = lazy(() => import('./pages/Auth'))
const Checkout      = lazy(() => import('./pages/Checkout'))
const OrderSuccess  = lazy(() => import('./pages/Checkout/OrderSuccess'))
const Profile       = lazy(() => import('./pages/Profile'))
const Admin         = lazy(() => import('./pages/Admin'))

// ─── Category Pages (Enhanced standalone pages) ─────────────────────────────
const Men           = lazy(() => import('./pages/Shop/Men'))
const Women         = lazy(() => import('./pages/Shop/Women'))
const Kids          = lazy(() => import('./pages/Shop/Kids'))
const Accessories   = lazy(() => import('./pages/Shop/Accessories'))
const Shop          = lazy(() => import('./pages/Shop/Shop'))

// ─── Accessibility: Skip to content link ─────────────────────────────────────
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-200"
    >
      Skip to main content
    </a>
  )
}

// ─── Scroll-to-top on every route change ─────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

// ─── Accessibility: Announce route changes to screen readers ─────────────────
function RouteAnnouncer() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const announcerRef = useRef(null)

  useEffect(() => {
    const pageName = pathname === '/' ? 'Home' : pathname.split('/').filter(Boolean)[0]?.capitalize() || 'Page'
    const action = navigationType === 'PUSH' ? 'Navigated to' : navigationType === 'REPLACE' ? 'Loaded' : 'Visited'
    
    if (announcerRef.current) {
      announcerRef.current.textContent = `${action} ${pageName}`
    }
  }, [pathname, navigationType])

  return (
    <span
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )
}

// ─── Accessibility: Focus management on route change ─────────────────────────
function FocusManager() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)

  useEffect(() => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1')
      mainContent.focus({ preventScroll: true })
    }
  }, [pathname])

  return null
}

// ─── Page-level fade transition with reduced motion support ──────────────────
function PageTransition({ children }) {
  const { pathname } = useLocation()
  
  const getAnimationClass = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'transition-opacity duration-100'
    }
    return 'transition-all duration-300 ease-out transform'
  }, [])

  return (
    <div
      key={pathname}
      className={`page-transition ${getAnimationClass()}`}
      style={{
        opacity: 0,
        transform: 'translateY(8px)',
        animation: 'pageFadeIn var(--animation-duration, 300ms) ease-out forwards',
        willChange: 'opacity, transform',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}
    >
      {children}
    </div>
  )
}

// ─── Global styles & CSS custom properties for animation system ──────────────
function GlobalAnimationStyles() {
  return (
    <style>{`
      :root {
        --animation-duration: 300ms;
        --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
        --focus-ring-color: 59 130 246;
        --focus-ring-offset: 2px;
      }

      @keyframes pageFadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        .page-transition {
          animation: none !important;
          transition: none !important;
          transform: none !important;
          opacity: 1 !important;
        }
      }

      .page-transition {
        will-change: opacity, transform;
        backface-visibility: hidden;
        perspective: 1000;
      }

      html {
        scroll-behavior: smooth;
        scroll-padding-top: 2rem;
      }

      :focus:not(:focus-visible) {
        outline: none;
      }
      :focus-visible {
        outline: 2px solid rgb(var(--focus-ring-color));
        outline-offset: var(--focus-ring-offset);
        border-radius: 0.375rem;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: inherit;
        margin: inherit;
        overflow: visible;
        clip: auto;
        white-space: inherit;
      }
    `}</style>
  )
}

// ─── String helper for route announcer ───────────────────────────────────────
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
      <GlobalAnimationStyles />
      <SkipToContent />
      <RouteAnnouncer />
      <FocusManager />
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 flex flex-col" id="main-content" role="main" aria-label="Main content">
        <Suspense fallback={<Loader fullScreen ariaLabel="Loading page content" />}>
          <PageTransition>
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/" element={<Home />} />
              
              {/* ── Enhanced Category Pages ── */}
              <Route path="/men" element={<Men />} />
              <Route path="/women" element={<Women />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/accessories" element={<Accessories />} />
              
              {/* ── Generic Shop Page (fallback) ── */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              
              {/* ── Product & Cart ── */}
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />

              {/* ── Protected: Authenticated users ── */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/order-success/:orderId" element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } />
              <Route path="/profile/*" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* ── Protected: Admin only ── */}
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } />

              {/* ── 404 Fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default App