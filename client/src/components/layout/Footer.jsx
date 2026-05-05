import React from 'react';
import { Link } from 'react-router-dom';

// Heroicons SVGs
const EnvelopeIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const PhoneIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPinIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FacebookIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12.315 15.951c.058-.378-.012-.604-.076-.765.051-.292.084-.556.095-.785.017-.278-.038-.639-.383-.739s-.575.09-.728.288c-.133.16-.267.388-.399.559-.142.172-.217.328-.204.492.013.172.108.398.245.545.137.147.374.258.572.331.174.033.392.056.587.07.182.01.287.006.347-.106.12-.27.049-.494-.211-.652zm-.145-3.664c-.339.02-.67.028-.988.02-.304 0-.614-.006-.893-.02-.277-.013-.566.008-.823.064-.303.07-.564.22-.647.47-.083.25-.086.571.025.85.11.277.283.487.57.56.287.073.614.04.883-.12.267-.16.467-.44.498-.784.032-.344.01-.66-.08-.942-.09-.282-.253-.44-.533-.456zm1.379 1.97c-.038.178-.178.329-.422.347-.244.018-.52-.026-.772-.152-.251-.126-.464-.33-.526-.568-.062-.238-.008-.483.127-.661.134-.178.36-.275.617-.245.257.03.489.159.577.382.088.223.028.46-.15.603zm.182-.257c-.088-.071-.203-.072-.343-.006-.14.066-.252.208-.252.399 0 .19.112.331.252.397.14.066.255.005.343-.066.088-.071.127-.212.127-.402 0-.19-.039-.331-.127-.397z" clipRule="evenodd"/>
    <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.921.146-6.462 1.73-6.61 6.61-.057 1.281-.072 1.69-.072 4.947 0 3.258.014 3.668.072 4.948.148 4.88 1.692 6.46 6.61 6.61 1.28.057 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.924-.146 6.467-1.733 6.61-6.61.057-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.148-4.921-1.692-6.462-6.61-6.61-1.28-.057-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162c0-3.403-2.759-6.162-6.162-6.162z" clipRule="evenodd"/>
    <path d="M12 16c-2.762 0-5-2.238-5-5s2.238-5 5-5 5 2.238 5 5-2.238 5-5 5z"/>
  </svg>
);

const TwitterIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-2xl font-bold mb-4">FLEXWEAR</h3>
            <p className="text-gray-400 mb-6">Best fashion for everyone</p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group">
                <FacebookIcon className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group">
                <InstagramIcon className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group">
                <TwitterIcon className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/men" className="text-gray-400 hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/women" className="text-gray-400 hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/kids" className="text-gray-400 hover:text-white transition-colors">Kids</Link></li>
              <li><Link to="/accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Help</h4>
            <ul className="space-y-3">
              <li><a href="#track" className="text-gray-400 hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#returns" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <a href="mailto:support@flexwear.in" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <EnvelopeIcon />
                <span>support@flexwear.in</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <PhoneIcon />
                <span>+91 98765 43210</span>
              </a>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPinIcon />
                <span>123 Fashion Street<br />Mumbai, Maharashtra 400001<br />India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 mb-4">
            © {currentYear} FlexWear. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="#privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

