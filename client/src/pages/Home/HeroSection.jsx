import { Link } from 'react-router-dom';

// ─── Floating badge ───────────────────────────────────────────────────────────
const Badge = ({ children, style }) => (
  <span
    style={style}
    className="absolute hidden lg:flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 select-none pointer-events-none"
  >
    {children}
  </span>
);

const HeroSection = () => {
  return (
    <section
      aria-label="New Collection 2026"
      className="relative min-h-[600px] md:min-h-[700px] overflow-hidden bg-white py-12 md:py-20"
    >
      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroImageReveal {
          from { opacity: 0; transform: translateX(32px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);    opacity: 0.6; }
          100% { transform: scale(1.55); opacity: 0; }
        }

        .hero-fade-1 { animation: heroFadeUp 0.6s ease 0.05s both; }
        .hero-fade-2 { animation: heroFadeUp 0.6s ease 0.18s both; }
        .hero-fade-3 { animation: heroFadeUp 0.6s ease 0.30s both; }
        .hero-fade-4 { animation: heroFadeUp 0.6s ease 0.42s both; }
        .hero-image   { animation: heroImageReveal 0.75s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .badge-float  { animation: badgeFloat 3.6s ease-in-out infinite; }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            #1e40af 0%, #6366f1 35%, #818cf8 50%, #6366f1 65%, #1e40af 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.22); }
        .btn-primary:active { transform: translateY(0);    box-shadow: 0 4px 12px rgba(0,0,0,0.16); }

        .btn-outline {
          transition: transform 0.18s ease, background 0.22s ease, color 0.22s ease;
        }
        .btn-outline:hover  { transform: translateY(-2px); }
        .btn-outline:active { transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-1, .hero-fade-2, .hero-fade-3, .hero-fade-4,
          .hero-image, .badge-float, .shimmer-text {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            -webkit-text-fill-color: #1e40af;
          }
        }
      `}</style>

      {/* ── Decorative background blobs ────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-right warm blob */}
        <div
          className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />
        {/* Bottom-left cool blob */}
        <div
          className="absolute -bottom-16 -left-16 w-[360px] h-[360px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* ── TEXT SECTION ───────────────────────────────────────────────── */}
          <div className="w-full lg:w-5/12 text-left">

            {/* Season tag */}
            <div className="hero-fade-1 inline-flex items-center gap-2 mb-5">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
                  style={{ animation: 'pulseRing 1.4s ease-out infinite' }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Spring / Summer 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-fade-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-5 tracking-tight text-slate-900">
              NEW
              <br />
              COLLECTION
              <span className="block shimmer-text">2026</span>
            </h1>

            {/* Sub-copy */}
            <p className="hero-fade-3 text-base sm:text-lg md:text-xl mb-3 max-w-md text-slate-500 font-medium leading-relaxed">
              Discover trend-forward fashion crafted for everyone — bold silhouettes, timeless fabrics, effortless style.
            </p>

            {/* Trust micro-stat */}
            <p className="hero-fade-3 text-xs text-slate-400 mb-8 font-medium tracking-wide">
              Free shipping on orders over ₹999 &nbsp;·&nbsp; Easy 30-day returns
            </p>

            {/* CTAs */}
            <div className="hero-fade-4 flex flex-col sm:flex-row gap-3">
              <Link
                to="/men"
                className="btn-primary inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Shop Men
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                to="/women"
                className="btn-outline inline-flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 px-7 py-3.5 rounded-full text-sm font-bold hover:bg-slate-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Shop Women
              </Link>

              <Link
                to="/kids"
                className="btn-outline inline-flex items-center justify-center gap-2 border-2 border-transparent text-indigo-600 px-7 py-3.5 rounded-full text-sm font-semibold hover:border-indigo-100 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                Kids
              </Link>

              <Link
                to="/accessories"
                className="btn-outline inline-flex items-center justify-center gap-2 border-2 border-transparent text-indigo-600 px-7 py-3.5 rounded-full text-sm font-semibold hover:border-indigo-100 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                Accessories
              </Link>
            </div>
          </div>

          {/* ── IMAGE SECTION ──────────────────────────────────────────────── */}
          <div className="w-full lg:w-7/12 flex justify-center lg:justify-center xl:justify-end">
            <div className="relative w-full flex justify-center items-center">

              {/* Glow halo behind image */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  className="w-[75%] h-[75%] rounded-full opacity-20 blur-3xl"
                  style={{ background: 'radial-gradient(ellipse, #a5b4fc, #818cf8, transparent 70%)' }}
                />
              </div>

              {/* Hero image */}
              <img
                src="/images/hero.png"
                alt="Model wearing Flexwear New Collection 2026"
                loading="eager"
                decoding="async"
                className="hero-image relative w-[90%] sm:w-[85%] md:w-[80%] lg:w-full h-auto object-contain drop-shadow-2xl"
              />

              {/* Floating badges */}
              <Badge style={{ top: '10%', left: '2%', animation: 'badgeFloat 3.6s ease-in-out 0s infinite' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                New Arrivals
              </Badge>

              <Badge style={{ bottom: '18%', left: '0%', animation: 'badgeFloat 3.6s ease-in-out 0.9s infinite' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 inline-block" />
                Free Shipping
              </Badge>

              <Badge style={{ top: '38%', right: '2%', animation: 'badgeFloat 3.6s ease-in-out 1.8s infinite' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                ⭐ 4.9 / 5
              </Badge>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;