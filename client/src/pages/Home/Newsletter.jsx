import { useState } from 'react';
import toast from 'react-hot-toast';

// ─── Icons ────────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

// ─── Perks strip ──────────────────────────────────────────────────────────────
const PERKS = [
  { icon: '🎁', label: 'Exclusive offers' },
  { icon: '👗', label: 'New arrivals first' },
  { icon: '🚚', label: 'Free shipping deals' },
  { icon: '🔕', label: 'No spam, ever' },
];

// ─── Newsletter ───────────────────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !isValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success('Welcome to Flexwear! 🎉');
      setSubscribed(true);
      setEmail('');
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative py-12 md:py-16 overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      <style>{`
        @keyframes nlReveal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes perkFade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .nl-reveal  { animation: nlReveal 0.55s ease both; }
        .nl-reveal-2{ animation: nlReveal 0.55s ease 0.12s both; }
        .nl-reveal-3{ animation: nlReveal 0.55s ease 0.22s both; }
        .success-pop{ animation: successPop 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .nl-reveal, .nl-reveal-2, .nl-reveal-3, .success-pop {
            animation: none !important; opacity: 1 !important;
          }
        }
      `}</style>

      {/* ── Background ────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 bg-slate-900">
        {/* Indigo blob left */}
        <div
          className="absolute -left-24 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />
        {/* Pink blob right */}
        <div
          className="absolute -right-24 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* ── Eyebrow ─────────────────────────────────────────────────── */}
        <div className="nl-reveal inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-indigo-400/60" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
            Stay in the loop
          </span>
          <span className="h-px w-8 bg-indigo-400/60" />
        </div>

        {/* ── Heading ─────────────────────────────────────────────────── */}
        <h2
          id="newsletter-heading"
          className="nl-reveal-2 text-2xl md:text-3xl font-black text-white leading-tight mb-3"
        >
          Get Exclusive Deals &<br />
          <span className="text-indigo-400">New Arrivals First</span>
        </h2>

        <p className="nl-reveal-2 text-sm text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
          Join 12,000+ fashion lovers. One email a week — trends, drops, and members-only discounts.
        </p>

        {/* ── Perks strip ─────────────────────────────────────────────── */}
        <div className="nl-reveal-3 flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8">
          {PERKS.map(({ icon, label }, i) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"
              style={{ animation: `perkFade 0.4s ease ${0.28 + i * 0.07}s both` }}
            >
              <span>{icon}</span>
              {label}
            </span>
          ))}
        </div>

        {/* ── Form / Success ───────────────────────────────────────────── */}
        {subscribed ? (
          <div className="success-pop flex flex-col items-center gap-3 py-6">
            <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckIcon />
            </div>
            <p className="text-white font-bold text-lg">You're subscribed!</p>
            <p className="text-slate-400 text-sm">Check your inbox for a welcome gift 🎁</p>
            <button
              onClick={() => setSubscribed(false)}
              className="mt-2 text-xs text-slate-500 underline underline-offset-2 hover:text-slate-300 transition-colors"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="nl-reveal-3 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            noValidate
          >
            {/* Input */}
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                disabled={loading}
                required
                className="
                  w-full pl-11 pr-4 py-3.5 rounded-full
                  bg-white/10 border border-white/15
                  text-white placeholder-slate-500 text-sm
                  backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60
                  disabled:opacity-50 transition-all duration-200
                "
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex items-center justify-center gap-2
                px-7 py-3.5 rounded-full
                bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                text-white text-sm font-bold
                shadow-lg shadow-indigo-900/40
                hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                whitespace-nowrap
              "
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Subscribing…
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        )}

        {/* ── Privacy note ─────────────────────────────────────────────── */}
        {!subscribed && (
          <p className="mt-4 text-[11px] text-slate-600 leading-relaxed">
            By subscribing you agree to our{' '}
            <a href="/privacy" className="underline underline-offset-2 hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            . Unsubscribe anytime.
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;