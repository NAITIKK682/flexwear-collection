import { Link } from 'react-router-dom'

// ─── Icons (simple, accessible) ──────────────────────────────────────────────
const EnvelopeIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.921.146-6.462 1.73-6.61 6.61-.057 1.281-.072 1.69-.072 4.947 0 3.258.014 3.668.072 4.948.148 4.88 1.692 6.46 6.61 6.61 1.28.057 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.924-.146 6.467-1.733 6.61-6.61-.148-4.921-1.692-6.462-6.61-6.61-1.28-.057-1.689-.072-4.948-.072z" clipRule="evenodd" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
)

// ─── Data ────────────────────────────────────────────────────────────────────
const SHOP_LINKS = [
  { label: 'Men', to: '/men' },
  { label: 'Women', to: '/women' },
  { label: 'Kids', to: '/kids' },
  { label: 'Accessories', to: '/accessories' },
]

const HELP_LINKS = [
  { label: 'Track Order', href: '#track' },
  { label: 'Returns', href: '#returns' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact Us', href: '#contact' },
]

const SOCIAL = [
  { label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'Twitter', href: 'https://twitter.com', icon: TwitterIcon },
]

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-slate-200 overflow-x-hidden" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 min-w-0">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-semibold text-slate-900 hover:text-indigo-600 transition-colors duration-200"
              aria-label="Flexwear homepage"
            >
              Flexwear
            </Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Modern fashion for everyone.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex gap-2.5">
              {SOCIAL.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.label}`}
                    className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 touch-target"
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Shop
            </p>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Help
            </p>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <EnvelopeIcon />
                <a href="mailto:support@flexwear.in" className="hover:text-indigo-600 transition-colors break-all">
                  support@flexwear.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <PhoneIcon />
                <a href="tel:+919876543210" className="hover:text-indigo-600 transition-colors">
                  +91 8948866980
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon />
                <span className="break-words">Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-3 text-xs text-slate-400 text-center sm:text-left">
            <p>© {year} Flexwear. All rights reserved.</p>
            <p className="text-slate-300 hidden sm:block">|</p>
            <p>
              Designed & developed by{' '}
              <a 
                href="https://naitik-portfolio-1.onrender.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-indigo-600 transition-colors font-medium"
              >
                Naitik Kushwaha
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer