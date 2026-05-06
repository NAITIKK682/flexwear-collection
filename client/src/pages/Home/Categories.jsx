import { Link } from 'react-router-dom';

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    title:    'Men',
    subtitle: 'Bold & Modern',
    path:     '/men',
    image:    '/images/men.jpg',
    accent:   '#3b82f6',
    gradient: 'from-blue-600/80 via-blue-500/50 to-transparent',
    chip:     'bg-blue-500/20 text-blue-100 border-blue-400/30',
    count:    '120+ styles',
  },
  {
    title:    'Women',
    subtitle: 'Elegant & Trendy',
    path:     '/women',
    image:    '/images/women.jpg',
    accent:   '#ec4899',
    gradient: 'from-pink-600/80 via-pink-500/50 to-transparent',
    chip:     'bg-pink-500/20 text-pink-100 border-pink-400/30',
    count:    '200+ styles',
  },
  {
    title:    'Kids',
    subtitle: 'Fun & Comfortable',
    path:     '/kids',
    image:    '/images/kids.jpg',
    accent:   '#22c55e',
    gradient: 'from-green-600/80 via-green-500/50 to-transparent',
    chip:     'bg-green-500/20 text-green-100 border-green-400/30',
    count:    '80+ styles',
  },
  {
    title:    'Accessories',
    subtitle: 'Complete the Look',
    path:     '/accessories',
    image:    '/images/accessories.jpg',
    accent:   '#a855f7',
    gradient: 'from-purple-600/80 via-purple-500/50 to-transparent',
    chip:     'bg-purple-500/20 text-purple-100 border-purple-400/30',
    count:    '60+ items',
  },
];

// ─── Arrow icon ───────────────────────────────────────────────────────────────
const ArrowIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ─── Category card ────────────────────────────────────────────────────────────
const CategoryCard = ({ category, index }) => (
  <Link
    to={category.path}
    aria-label={`Shop ${category.title}`}
    className="group relative block rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
    style={{ animation: `catReveal 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 0.09}s both` }}
  >
    {/* ── Image ── */}
    <div className="relative h-56 sm:h-64 md:h-72 bg-slate-200 overflow-hidden">
      <img
        src={category.image}
        alt={`${category.title} fashion collection`}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />

      {/* Permanent dark gradient from bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Accent colour gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`} />

      {/* Accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${category.accent}, transparent 70%)` }}
      />
    </div>

    {/* ── Content overlay ── */}
    <div className="absolute inset-0 flex flex-col justify-end p-4">

      {/* Style count chip — slides up on hover */}
      <span
        className={[
          'self-start mb-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm',
          category.chip,
          'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out',
        ].join(' ')}
      >
        {category.count}
      </span>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md group-hover:translate-x-0.5 transition-transform duration-300">
        {category.title}
      </h3>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-white/70 font-medium mt-0.5 mb-2">
        {category.subtitle}
      </p>

      {/* Shop now CTA — slides up on hover */}
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 uppercase tracking-widest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out delay-75">
        Shop now <ArrowIcon />
      </span>
    </div>

    {/* ── Accent border on hover ── */}
    <div
      className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition-all duration-300"
      style={{ '--tw-ring-color': category.accent + '66' }}
    />
  </Link>
);

// ─── Categories ───────────────────────────────────────────────────────────────
const Categories = () => (
  <section className="py-10 md:py-14 bg-slate-950" aria-labelledby="categories-heading">
    <style>{`
      @keyframes catHeadReveal {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes catReveal {
        from { opacity: 0; transform: translateY(24px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @media (prefers-reduced-motion: reduce) {
        [style*="catReveal"], [style*="catHeadReveal"] {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div
        className="text-center mb-8"
        style={{ animation: 'catHeadReveal 0.5s ease both' }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400 mb-1.5">
          Explore the range
        </p>
        <h2
          id="categories-heading"
          className="text-2xl md:text-3xl font-black text-white leading-tight"
        >
          Shop by Category
        </h2>
        <p className="mt-2 text-slate-400 text-sm max-w-sm mx-auto">
          From everyday essentials to statement pieces — find your style.
        </p>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((category, index) => (
          <CategoryCard key={category.title} category={category} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default Categories;