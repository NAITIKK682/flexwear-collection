import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

// ─── Icons ────────────────────────────────────────────────────────────────────
const StarIcon = ({ filled = true }) => (
  <svg
    className={`h-3.5 w-3.5 ${filled ? 'text-amber-400' : 'text-slate-200'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-slate-100 animate-pulse">
    <div className="h-64 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// ─── Star rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating = 0, count }) => {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < filled} />
        ))}
      </div>
      {count > 0 && (
        <span className="text-[11px] text-slate-400 font-medium">({count})</span>
      )}
    </div>
  );
};

// ─── Product card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const hasDiscount  = product.discountedPrice && product.price && product.discountedPrice < product.price;
  const discountPct  = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;
  const displayPrice = hasDiscount ? product.discountedPrice : product.price;
  const isNew        = index < 2; // first two cards get a "New" tag
  const isLowStock   = product.stock > 0 && product.stock <= 5;

  return (
    <Link
      to={`/product/${product._id}`}
      aria-label={`View ${product.name}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-2xl"
      style={{ animation: `featCardReveal 0.5s ease ${(index % 4) * 0.08}s both` }}
    >
      <article className="h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">

        {/* Image wrapper */}
        <div className="relative h-64 overflow-hidden bg-slate-50 flex-shrink-0">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="inline-flex items-center bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                -{discountPct}%
              </span>
            )}
            {isNew && !hasDiscount && (
              <span className="inline-flex items-center bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                NEW
              </span>
            )}
          </div>

          {/* Low stock warning */}
          {isLowStock && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
              Only {product.stock} left
            </span>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-2 flex-1">
          {/* Category chip */}
          {product.category && (
            <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
              {product.category}
            </span>
          )}

          {/* Name */}
          <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-200 leading-snug">
            {product.name}
          </h3>

          {/* Stars */}
          {product.averageRating > 0 && (
            <StarRating rating={product.averageRating} count={product.numReviews || 0} />
          )}

          {/* Price row */}
          <div className="flex items-baseline gap-2 mt-auto pt-2">
            <span className="text-lg font-black text-slate-900">
              ₹{displayPrice?.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through font-medium">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-semibold text-emerald-600 ml-auto">
                Save ₹{(product.price - product.discountedPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

// ─── Error / empty state ──────────────────────────────────────────────────────
const EmptyState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl" aria-hidden="true">
      {error ? '⚠️' : '🛍️'}
    </div>
    <p className="text-slate-500 text-base font-medium">
      {error ? 'Failed to load featured products.' : 'No featured products available yet.'}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-1 inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-slate-700 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
    >
      {error ? 'Try again' : 'Refresh'}
    </button>
  </div>
);

// ─── FeaturedProducts ─────────────────────────────────────────────────────────
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts({
        limit: 8,
        featured: true,
        sort: '-createdAt',
      });
      setProducts(response.data?.data || response.data?.products || []);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load featured products';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeatured(); }, [fetchFeatured]);

  const featuredProducts = Array.isArray(products) ? products.slice(0, 8) : [];

  return (
    <section className="py-20 bg-white" aria-labelledby="featured-heading">
      <style>{`
        @keyframes featHeadReveal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes featCardReveal {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="featCardReveal"], [style*="featHeadReveal"] {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
          style={{ animation: 'featHeadReveal 0.5s ease both' }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500 mb-2">
              Handpicked for you
            </p>
            <h2
              id="featured-heading"
              className="text-3xl md:text-4xl font-black text-slate-900 leading-tight"
            >
              Featured Products
            </h2>
          </div>
          <Link
            to="/men"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 group/link shrink-0"
          >
            View all
            <span className="group-hover/link:translate-x-1 transition-transform duration-200">
              <ArrowRightIcon />
            </span>
          </Link>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !loading && (error || featuredProducts.length === 0) ? (
          <EmptyState error={error} onRetry={fetchFeatured} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;