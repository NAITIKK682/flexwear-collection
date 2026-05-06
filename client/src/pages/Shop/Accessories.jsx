import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

// ============================================================================
// 🎨 THEME & IMAGE PATHS
// ============================================================================
const THEME = { primary: 'indigo-600', hover: 'indigo-700', light: 'indigo-50' }

const ACC_IMAGES = {
  hero: '/images/accessories/hero-banner.jpg',
  watches: '/images/accessories/watches/watch1.jpg',
  bags: '/images/accessories/bags/bag1.jpg',
  sunglasses: '/images/accessories/sunglasses/sun1.jpg',
  belts: '/images/accessories/belts/belt1.jpg',
  jewelry: '/images/accessories/jewelry/jewelry1.jpg',
  caps: '/images/accessories/caps/cap1.jpg',
  wallets: '/images/accessories/wallets/wallet1.jpg',
  placeholder: '/images/placeholder-product.jpg'
}

// ============================================================================
// 📦 PRODUCT DATA (7 Categories × 6 Products = 42 Total)
// ============================================================================
const SAMPLE_PRODUCTS = {
  watches: [
    { _id: 'aw1', name: 'Analog Chronograph Watch', price: 2999, discountedPrice: 2499, image: ACC_IMAGES.watches, rating: 4.7, reviews: 312, category: 'accessories', sizes: ['One Size'], colors: ['Silver', 'Black', 'Gold'], description: 'Premium stainless steel chronograph', isNew: false, isBestseller: true, stock: 67, type: 'Watches' },
    { _id: 'aw2', name: 'Digital Sport Watch', price: 1999, discountedPrice: 1599, image: ACC_IMAGES.watches, rating: 4.5, reviews: 245, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Navy', 'Red'], description: 'Water-resistant digital sport watch', isNew: true, isBestseller: false, stock: 89, type: 'Watches' },
    { _id: 'aw3', name: 'Leather Strap Classic', price: 2499, discountedPrice: 1999, image: ACC_IMAGES.watches, rating: 4.8, reviews: 189, category: 'accessories', sizes: ['One Size'], colors: ['Brown', 'Black', 'Tan'], description: 'Elegant leather strap timepiece', isNew: false, isBestseller: true, stock: 54, type: 'Watches' },
    { _id: 'aw4', name: 'Smart Fitness Watch', price: 3999, discountedPrice: 3499, image: ACC_IMAGES.watches, rating: 4.6, reviews: 278, category: 'accessories', sizes: ['S', 'M', 'L'], colors: ['Black', 'White', 'Blue'], description: 'Health tracking smartwatch', isNew: true, isBestseller: true, stock: 43, type: 'Watches' },
    { _id: 'aw5', name: 'Minimalist Rose Gold', price: 2799, discountedPrice: 2299, image: ACC_IMAGES.watches, rating: 4.9, reviews: 156, category: 'accessories', sizes: ['One Size'], colors: ['Rose Gold', 'Silver'], description: 'Sleek minimalist design', isNew: false, isBestseller: true, stock: 38, type: 'Watches' },
    { _id: 'aw6', name: 'Vintage Pocket Watch', price: 3499, discountedPrice: 2999, image: ACC_IMAGES.watches, rating: 4.4, reviews: 134, category: 'accessories', sizes: ['One Size'], colors: ['Gold', 'Bronze'], description: 'Classic vintage pocket watch', isNew: false, isBestseller: false, stock: 29, type: 'Watches' },
  ],
  bags: [
    { _id: 'ab1', name: 'Leather Crossbody Bag', price: 2499, discountedPrice: 1999, image: ACC_IMAGES.bags, rating: 4.7, reviews: 289, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Brown', 'Tan'], description: 'Premium leather crossbody', isNew: false, isBestseller: true, stock: 78, type: 'Bags' },
    { _id: 'ab2', name: 'Canvas Backpack', price: 1999, discountedPrice: 1599, image: ACC_IMAGES.bags, rating: 4.5, reviews: 312, category: 'accessories', sizes: ['One Size'], colors: ['Navy', 'Grey', 'Olive'], description: 'Durable everyday backpack', isNew: true, isBestseller: false, stock: 94, type: 'Bags' },
    { _id: 'ab3', name: 'Tote Bag Spacious', price: 1799, discountedPrice: 1399, image: ACC_IMAGES.bags, rating: 4.6, reviews: 234, category: 'accessories', sizes: ['One Size'], colors: ['Beige', 'Black', 'White'], description: 'Large capacity tote', isNew: false, isBestseller: true, stock: 87, type: 'Bags' },
    { _id: 'ab4', name: 'Sling Bag Compact', price: 1499, discountedPrice: 1199, image: ACC_IMAGES.bags, rating: 4.4, reviews: 198, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Green', 'Blue'], description: 'Hands-free compact sling', isNew: false, isBestseller: false, stock: 112, type: 'Bags' },
    { _id: 'ab5', name: 'Duffle Travel Bag', price: 2999, discountedPrice: 2499, image: ACC_IMAGES.bags, rating: 4.8, reviews: 167, category: 'accessories', sizes: ['Medium', 'Large'], colors: ['Black', 'Navy', 'Grey'], description: 'Weekend travel duffle', isNew: true, isBestseller: true, stock: 56, type: 'Bags' },
    { _id: 'ab6', name: 'Clutch Evening Bag', price: 1299, discountedPrice: 999, image: ACC_IMAGES.bags, rating: 4.5, reviews: 223, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Gold', 'Silver'], description: 'Elegant evening clutch', isNew: false, isBestseller: true, stock: 68, type: 'Bags' },
  ],
  sunglasses: [
    { _id: 'as1', name: 'Aviator Classic', price: 1499, discountedPrice: 1199, image: ACC_IMAGES.sunglasses, rating: 4.8, reviews: 345, category: 'accessories', sizes: ['One Size'], colors: ['Gold/Green', 'Silver/Blue', 'Black/Grey'], description: 'Timeless aviator design', isNew: false, isBestseller: true, stock: 134, type: 'Sunglasses' },
    { _id: 'as2', name: 'Wayfarer Square', price: 1299, discountedPrice: 999, image: ACC_IMAGES.sunglasses, rating: 4.6, reviews: 278, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Tortoise', 'Blue'], description: 'Bold square wayfarer', isNew: false, isBestseller: true, stock: 98, type: 'Sunglasses' },
    { _id: 'as3', name: 'Round Vintage', price: 1399, discountedPrice: 1099, image: ACC_IMAGES.sunglasses, rating: 4.5, reviews: 189, category: 'accessories', sizes: ['One Size'], colors: ['Gold', 'Black', 'Brown'], description: 'Retro round frame', isNew: true, isBestseller: false, stock: 76, type: 'Sunglasses' },
    { _id: 'as4', name: 'Sport Wraparound', price: 1799, discountedPrice: 1499, image: ACC_IMAGES.sunglasses, rating: 4.7, reviews: 234, category: 'accessories', sizes: ['One Size'], colors: ['Black/Red', 'Blue/White'], description: 'UV400 sport protection', isNew: false, isBestseller: true, stock: 89, type: 'Sunglasses' },
    { _id: 'as5', name: 'Cat Eye Fashion', price: 1599, discountedPrice: 1299, image: ACC_IMAGES.sunglasses, rating: 4.4, reviews: 167, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Pink', 'Tortoise'], description: 'Stylish cat eye frame', isNew: false, isBestseller: false, stock: 67, type: 'Sunglasses' },
    { _id: 'as6', name: 'Polarized Driving', price: 1999, discountedPrice: 1599, image: ACC_IMAGES.sunglasses, rating: 4.9, reviews: 298, category: 'accessories', sizes: ['One Size'], colors: ['Grey', 'Brown', 'Blue'], description: 'Anti-glare polarized lenses', isNew: true, isBestseller: true, stock: 54, type: 'Sunglasses' },
  ],
  belts: [
    { _id: 'abl1', name: 'Leather Formal Belt', price: 1299, discountedPrice: 999, image: ACC_IMAGES.belts, rating: 4.7, reviews: 312, category: 'accessories', sizes: ['32', '34', '36', '38', '40'], colors: ['Black', 'Brown'], description: 'Genuine leather formal belt', isNew: false, isBestseller: true, stock: 124, type: 'Belts' },
    { _id: 'abl2', name: 'Casual Canvas Belt', price: 799, discountedPrice: 599, image: ACC_IMAGES.belts, rating: 4.5, reviews: 245, category: 'accessories', sizes: ['32', '34', '36', '38'], colors: ['Navy', 'Olive', 'Khaki'], description: 'Durable casual canvas', isNew: true, isBestseller: false, stock: 98, type: 'Belts' },
    { _id: 'abl3', name: 'Reversible Belt', price: 1599, discountedPrice: 1299, image: ACC_IMAGES.belts, rating: 4.8, reviews: 189, category: 'accessories', sizes: ['34', '36', '38', '40'], colors: ['Black/Brown'], description: 'Two-in-one reversible', isNew: false, isBestseller: true, stock: 67, type: 'Belts' },
    { _id: 'abl4', name: 'Braided Leather Belt', price: 1399, discountedPrice: 1099, image: ACC_IMAGES.belts, rating: 4.6, reviews: 167, category: 'accessories', sizes: ['32', '34', '36', '38'], colors: ['Tan', 'Dark Brown'], description: 'Stretchable braided design', isNew: false, isBestseller: false, stock: 78, type: 'Belts' },
    { _id: 'abl5', name: 'Automatic Buckle Belt', price: 1799, discountedPrice: 1499, image: ACC_IMAGES.belts, rating: 4.9, reviews: 234, category: 'accessories', sizes: ['34', '36', '38', '40', '42'], colors: ['Black', 'Brown'], description: 'Ratchet automatic buckle', isNew: true, isBestseller: true, stock: 89, type: 'Belts' },
    { _id: 'abl6', name: 'Web Military Belt', price: 999, discountedPrice: 799, image: ACC_IMAGES.belts, rating: 4.4, reviews: 198, category: 'accessories', sizes: ['32', '34', '36', '38'], colors: ['Black', 'Olive', 'Camo'], description: 'Heavy-duty web belt', isNew: false, isBestseller: true, stock: 112, type: 'Belts' },
  ],
  jewelry: [
    { _id: 'aj1', name: 'Sterling Silver Chain', price: 1999, discountedPrice: 1599, image: ACC_IMAGES.jewelry, rating: 4.7, reviews: 289, category: 'accessories', sizes: ['18"', '20"', '22"', '24"'], colors: ['Silver', 'Gold'], description: 'Premium 925 silver chain', isNew: false, isBestseller: true, stock: 76, type: 'Jewelry' },
    { _id: 'aj2', name: 'Gold Plated Bracelet', price: 1499, discountedPrice: 1199, image: ACC_IMAGES.jewelry, rating: 4.6, reviews: 234, category: 'accessories', sizes: ['Adjustable'], colors: ['Gold', 'Rose Gold'], description: 'Elegant gold plated bangle', isNew: true, isBestseller: false, stock: 94, type: 'Jewelry' },
    { _id: 'aj3', name: 'Pearl Earring Set', price: 1299, discountedPrice: 999, image: ACC_IMAGES.jewelry, rating: 4.8, reviews: 198, category: 'accessories', sizes: ['One Size'], colors: ['White', 'Black'], description: 'Classic pearl studs', isNew: false, isBestseller: true, stock: 67, type: 'Jewelry' },
    { _id: 'aj4', name: 'Signet Ring Men', price: 1799, discountedPrice: 1399, image: ACC_IMAGES.jewelry, rating: 4.5, reviews: 167, category: 'accessories', sizes: ['8', '9', '10', '11'], colors: ['Silver', 'Gold'], description: 'Bold signet ring', isNew: false, isBestseller: false, stock: 54, type: 'Jewelry' },
    { _id: 'aj5', name: 'Layered Necklace Set', price: 1599, discountedPrice: 1299, image: ACC_IMAGES.jewelry, rating: 4.9, reviews: 245, category: 'accessories', sizes: ['Adjustable'], colors: ['Gold', 'Silver'], description: 'Trendy layered chains', isNew: true, isBestseller: true, stock: 89, type: 'Jewelry' },
    { _id: 'aj6', name: 'Oxidized Tribal Earrings', price: 899, discountedPrice: 699, image: ACC_IMAGES.jewelry, rating: 4.4, reviews: 178, category: 'accessories', sizes: ['One Size'], colors: ['Silver'], description: 'Handcrafted tribal design', isNew: false, isBestseller: true, stock: 112, type: 'Jewelry' },
  ],
  caps: [
    { _id: 'ac1', name: 'Classic Baseball Cap', price: 799, discountedPrice: 599, image: ACC_IMAGES.caps, rating: 4.6, reviews: 312, category: 'accessories', sizes: ['Adjustable'], colors: ['Black', 'Navy', 'White', 'Red'], description: 'Cotton twill baseball cap', isNew: false, isBestseller: true, stock: 134, type: 'Caps' },
    { _id: 'ac2', name: 'Snapback Urban', price: 999, discountedPrice: 799, image: ACC_IMAGES.caps, rating: 4.5, reviews: 245, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Grey', 'Green'], description: 'Flat brim snapback', isNew: true, isBestseller: false, stock: 98, type: 'Caps' },
    { _id: 'ac3', name: 'Bucket Hat Summer', price: 699, discountedPrice: 549, image: ACC_IMAGES.caps, rating: 4.7, reviews: 189, category: 'accessories', sizes: ['M', 'L', 'XL'], colors: ['Beige', 'Black', 'Olive'], description: 'Reversible bucket hat', isNew: false, isBestseller: true, stock: 87, type: 'Caps' },
    { _id: 'ac4', name: 'Trucker Mesh Cap', price: 849, discountedPrice: 649, image: ACC_IMAGES.caps, rating: 4.4, reviews: 167, category: 'accessories', sizes: ['Adjustable'], colors: ['Black/White', 'Navy/Red'], description: 'Breathable mesh back', isNew: false, isBestseller: false, stock: 76, type: 'Caps' },
    { _id: 'ac5', name: 'Beanie Winter Knit', price: 599, discountedPrice: 449, image: ACC_IMAGES.caps, rating: 4.8, reviews: 234, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Grey', 'Maroon', 'Navy'], description: 'Warm knitted beanie', isNew: true, isBestseller: true, stock: 112, type: 'Caps' },
    { _id: 'ac6', name: 'Fedora Stylish', price: 1299, discountedPrice: 999, image: ACC_IMAGES.caps, rating: 4.5, reviews: 156, category: 'accessories', sizes: ['S', 'M', 'L'], colors: ['Black', 'Brown', 'Grey'], description: 'Classic felt fedora', isNew: false, isBestseller: true, stock: 54, type: 'Caps' },
  ],
  wallets: [
    { _id: 'awl1', name: 'Bifold Leather Wallet', price: 1499, discountedPrice: 1199, image: ACC_IMAGES.wallets, rating: 4.8, reviews: 289, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Brown', 'Tan'], description: 'Slim bifold with RFID', isNew: false, isBestseller: true, stock: 98, type: 'Wallets' },
    { _id: 'awl2', name: 'Card Holder Minimal', price: 999, discountedPrice: 799, image: ACC_IMAGES.wallets, rating: 4.6, reviews: 234, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Navy', 'Grey'], description: 'Ultra-slim card holder', isNew: true, isBestseller: false, stock: 87, type: 'Wallets' },
    { _id: 'awl3', name: 'Long Zip Wallet', price: 1799, discountedPrice: 1399, image: ACC_IMAGES.wallets, rating: 4.7, reviews: 198, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Brown'], description: 'Spacious zip-around wallet', isNew: false, isBestseller: true, stock: 67, type: 'Wallets' },
    { _id: 'awl4', name: 'Travel Passport Wallet', price: 1999, discountedPrice: 1599, image: ACC_IMAGES.wallets, rating: 4.9, reviews: 167, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Navy', 'Burgundy'], description: 'RFID passport organizer', isNew: true, isBestseller: true, stock: 54, type: 'Wallets' },
    { _id: 'awl5', name: 'Coin Purse Vintage', price: 799, discountedPrice: 599, image: ACC_IMAGES.wallets, rating: 4.4, reviews: 145, category: 'accessories', sizes: ['One Size'], colors: ['Brown', 'Black', 'Tan'], description: 'Leather coin pouch', isNew: false, isBestseller: false, stock: 78, type: 'Wallets' },
    { _id: 'awl6', name: 'Money Clip Slim', price: 1299, discountedPrice: 999, image: ACC_IMAGES.wallets, rating: 4.5, reviews: 178, category: 'accessories', sizes: ['One Size'], colors: ['Silver', 'Black', 'Gold'], description: 'Stainless steel money clip', isNew: false, isBestseller: true, stock: 89, type: 'Wallets' },
  ]
}

const SECTIONS = [
  { id: 'watches', title: 'Watches', subtitle: 'Timeless precision & style', bgColor: 'from-indigo-50 to-white', showViewAll: true },
  { id: 'bags', title: 'Bags', subtitle: 'Carry your essentials in style', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'sunglasses', title: 'Sunglasses', subtitle: 'UV protection meets fashion', bgColor: 'from-indigo-50 to-white', showViewAll: true },
  { id: 'belts', title: 'Belts', subtitle: 'Complete your outfit', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'jewelry', title: 'Jewelry', subtitle: 'Chains, rings & earrings', bgColor: 'from-indigo-50 to-white', showViewAll: true },
  { id: 'caps', title: 'Caps & Hats', subtitle: 'Headwear for every season', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'wallets', title: 'Wallets', subtitle: 'Slim, secure & stylish', bgColor: 'from-indigo-50 to-white', showViewAll: true },
]

// ============================================================================
// 🎨 UTILITIES & COMPONENTS
// ============================================================================
const calcDiscount = (p, d) => (p && d && p !== d ? Math.round(((p - d) / p) * 100) : 0)
const fmtPrice = (p) => `₹${p.toLocaleString('en-IN')}`

const StarRating = memo(({ rating, size = 'sm' }) => (
  <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating}/5`}>
    {[1,2,3,4,5].map(s => <svg key={s} className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} ${s <= rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
  </div>
))

const Badge = memo(({ children, variant = 'primary', className = '' }) => {
  const v = { primary: 'bg-indigo-600 text-white', secondary: 'bg-slate-100 text-slate-700', success: 'bg-green-100 text-green-700', warning: 'bg-yellow-100 text-yellow-700' }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${v[variant]} ${className}`}>{children}</span>
})

const Button = memo(({ children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled = false, onClick, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50'
  const v = { primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 active:scale-95', secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50', ghost: 'text-indigo-600 hover:bg-indigo-50', outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50' }
  const s = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5', lg: 'px-7 py-3 text-base', xl: 'px-9 py-4 text-lg' }
  return <button onClick={onClick} disabled={disabled || loading} className={`${base} ${v[variant]} ${s[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>{loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}{children}</button>
})

const ProductCard = memo(({ product, onAddToCart, onQuickView, onWishlist, isAdding, isInWishlist }) => {
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const disc = calcDiscount(product.price, product.discountedPrice)
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} role="article">
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {!loaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}
        <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'} ${loaded ? 'opacity-100' : 'opacity-0'}`} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="primary">New</Badge>}
          {product.isBestseller && <Badge variant="warning">Bestseller</Badge>}
          {disc > 0 && <Badge variant="success">-{disc}%</Badge>}
        </div>
        <div className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button variant="primary" size="sm" fullWidth onClick={(e) => { e.stopPropagation(); onAddToCart?.(product) }} disabled={isAdding || product.stock === 0} loading={isAdding} className="flex-1">{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</Button>
          <button onClick={(e) => { e.stopPropagation(); onQuickView?.(product) }} className="p-2.5 bg-white rounded-xl border border-slate-200 hover:bg-slate-50" aria-label="Quick view"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
          <button onClick={(e) => { e.stopPropagation(); onWishlist?.(product) }} className={`p-2.5 rounded-xl border transition-colors ${isInWishlist ? 'bg-red-50 text-red-500' : 'bg-white hover:bg-red-50 hover:text-red-500'}`} aria-label="Wishlist"><svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
        </div>
      </div>
      <div className="p-4">
        {product.type && <p className="text-xs text-slate-400 uppercase mb-1">{product.type}</p>}
        <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3"><StarRating rating={product.rating} size="xs" /><span className="text-xs text-slate-400">({product.reviews})</span></div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-indigo-600">{fmtPrice(product.discountedPrice)}</span>
          {disc > 0 && <span className="text-sm text-slate-400 line-through">{fmtPrice(product.price)}</span>}
        </div>
      </div>
    </article>
  )
})

const FilterSidebar = memo(({ filters, setFilters, isOpen, onClose, onApply }) => {
  const prices = [{ l: 'Under ₹500', min: 0, max: 500 }, { l: '₹500-₹1,000', min: 500, max: 1000 }, { l: '₹1,000-₹2,000', min: 1000, max: 2000 }, { l: '₹2,000-₹5,000', min: 2000, max: 5000 }, { l: 'Above ₹5,000', min: 5000, max: 99999 }]
  const colors = ['Black', 'White', 'Blue', 'Brown', 'Gold', 'Silver', 'Red', 'Green']
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 z-50 lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto p-6`}>
        <div className="flex items-center justify-between mb-6 lg:hidden"><h2 className="text-lg font-bold">Filters</h2><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
        <div className="space-y-6">
          <section><h3 className="font-semibold mb-3">Price Range</h3><div className="space-y-2">{prices.map((r, i) => <label key={i} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${filters.priceRange[0] === r.min && filters.priceRange[1] === r.max ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}><input type="radio" name="price" checked={filters.priceRange[0] === r.min && filters.priceRange[1] === r.max} onChange={() => setFilters({ ...filters, priceRange: [r.min, r.max] })} className="w-4 h-4 text-indigo-600" /><span className="text-sm">{r.l}</span></label>)}</div></section>
          <section><h3 className="font-semibold mb-3">Color</h3><div className="space-y-2">{colors.map(c => <label key={c} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"><input type="checkbox" checked={filters.colors.includes(c)} onChange={() => setFilters({ ...filters, colors: filters.colors.includes(c) ? filters.colors.filter(x => x !== c) : [...filters.colors, c] })} className="w-4 h-4 text-indigo-600 rounded" /><span className="text-sm">{c}</span></label>)}</div></section>
          <section className="space-y-3"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={filters.inStock} onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked }))} className="w-4 h-4 text-indigo-600 rounded" /><span className="text-sm">In Stock Only</span></label><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={filters.onSale} onChange={e => setFilters(f => ({ ...f, onSale: e.target.checked }))} className="w-4 h-4 text-indigo-600 rounded" /><span className="text-sm">On Sale</span></label></section>
          <Button variant="ghost" fullWidth onClick={() => { setFilters({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest', inStock: false, onSale: false }); onApply?.() }}>Clear All</Button>
        </div>
      </aside>
    </>
  )
})

// ============================================================================
// 🎯 MAIN ACCESSORIES PAGE
// ============================================================================
export default function Accessories() {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [products] = useState(SAMPLE_PRODUCTS)
  const [filters, setFilters] = useState({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest', inStock: false, onSale: false })
  const [addingId, setAddingId] = useState(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [wishlist, setWishlist] = useState(() => { try { return JSON.parse(localStorage.getItem('wishlist') || '[]') } catch { return [] } })
  const [viewed, setViewed] = useState(() => { try { return JSON.parse(localStorage.getItem('viewed') || '[]') } catch { return [] } })
  const sectionRefs = useRef({})

  useEffect(() => { try { localStorage.setItem('wishlist', JSON.stringify(wishlist)) } catch (e) {} }, [wishlist])
  useEffect(() => { try { localStorage.setItem('viewed', JSON.stringify(viewed.slice(-20))) } catch (e) {} }, [viewed])

  const handleAddToCart = useCallback(async (product) => {
    if (addingId === product._id) return
    try {
      setAddingId(product._id)
      if (!viewed.includes(product._id)) setViewed(p => [...p, product._id])
      await addToCart({ ...product, quantity: 1 })
      toast.success(`Added "${product.name}" to cart`, { duration: 2500, position: 'bottom-right' })
    } catch { toast.error('Failed to add to cart') }
    finally { setTimeout(() => setAddingId(null), 500) }
  }, [addToCart, addingId, viewed])

  const handleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.includes(product._id)
      toast(exists ? 'Removed from wishlist' : 'Added to wishlist', { duration: 2000, position: 'bottom-right', icon: exists ? '❤️' : '💙' })
      return exists ? prev.filter(id => id !== product._id) : [...prev, product._id]
    })
  }, [])

  const handleQuickView = useCallback((product) => {
    if (!viewed.includes(product._id)) setViewed(p => [...p, product._id])
    navigate(`/product/${product._id}`, { state: { from: '/accessories' } })
  }, [navigate, viewed])

  const filterProducts = useCallback((list) => list.filter(p => {
    const priceOk = p.discountedPrice >= filters.priceRange[0] && p.discountedPrice <= filters.priceRange[1]
    const colorOk = filters.colors.length === 0 || filters.colors.some(c => p.colors?.some(x => x.toLowerCase().includes(c.toLowerCase())))
    return priceOk && colorOk && (!filters.inStock || p.stock > 0) && (!filters.onSale || p.discountedPrice < p.price)
  }), [filters])

  const sortProducts = useCallback((list) => {
    const s = [...list]
    switch (filters.sortBy) {
      case 'price-low': return s.sort((a, b) => a.discountedPrice - b.discountedPrice)
      case 'price-high': return s.sort((a, b) => b.discountedPrice - a.discountedPrice)
      case 'rating': return s.sort((a, b) => b.rating - a.rating)
      default: return s.sort((a, b) => (a.isNew && !b.isNew) ? -1 : (!a.isNew && b.isNew) ? 1 : (a.isBestseller && !b.isBestseller) ? -1 : (!a.isBestseller && b.isBestseller) ? 1 : 0)
    }
  }, [filters.sortBy])

  const processed = useMemo(() => {
    const r = {}
    Object.entries(products).forEach(([k, v]) => r[k] = sortProducts(filterProducts(v)))
    return r
  }, [products, filters, filterProducts, sortProducts])

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[500px] bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-50" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-white/90 text-indigo-700">Premium Accessories</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">Accessories</h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Elevate your style with curated watches, bags, jewelry & more.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#shop" className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-700 font-semibold rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5">Shop Now</a>
            <Button variant="secondary" size="lg" onClick={() => sectionRefs.current['watches']?.scrollIntoView({ behavior: 'smooth' })}>Explore Categories</Button>
          </div>
        </div>
      </section>

      <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex mb-6 text-sm text-slate-500" aria-label="Breadcrumb"><ol className="flex items-center gap-2"><li><Link to="/" className="hover:text-indigo-600">Home</Link></li><li><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></li><li className="font-medium text-slate-900">Accessories</li></ol></nav>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg><span className="font-medium">Filters</span></button>
          <div className="flex items-center gap-3 ml-auto"><label className="text-sm text-slate-600 hidden sm:block">Sort by:</label><select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value })} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="newest">Newest</option><option value="price-low">Price: Low-High</option><option value="price-high">Price: High-Low</option><option value="rating">Top Rated</option></select></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1"><div className="lg:sticky lg:top-24"><FilterSidebar filters={filters} setFilters={setFilters} isOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} onApply={() => {}} /></div></div>
          <div className="lg:col-span-3 space-y-12 lg:space-y-16">
            {SECTIONS.map(sec => {
              const items = processed[sec.id] || []
              return (
                <section key={sec.id} id={sec.id} ref={el => sectionRefs.current[sec.id] = el} className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-b ${sec.bgColor}`}>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                    <div><h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{sec.title}</h2><p className="text-slate-500 text-sm sm:text-base">{sec.subtitle}</p></div>
                    {sec.showViewAll && <Link to={`/shop/${sec.id}`} className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700">View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>}
                  </div>
                  {items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">{items.map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} onQuickView={handleQuickView} onWishlist={handleWishlist} isAdding={addingId === p._id} isInWishlist={wishlist.includes(p._id)} />)}</div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100"><p className="text-slate-500 mb-4">No products match your filters</p><Button variant="ghost" onClick={() => setFilters({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest', inStock: false, onSale: false })}>Clear Filters</Button></div>
                  )}
                  {items.length >= 4 && sec.showViewAll && <div className="mt-8 text-center"><Button variant="outline" size="md" onClick={() => navigate(`/shop/${sec.id}`)}>View All {sec.title}</Button></div>}
                </section>
              )
            })}
          </div>
        </div>

        {viewed.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {viewed.slice(-6).reverse().map(id => {
                let p = null; for (const cat of Object.values(SAMPLE_PRODUCTS)) { const f = cat.find(x => x._id === id); if (f) { p = f; break } }
                if (!p) return null
                return <button key={id} onClick={() => navigate(`/product/${id}`)} className="text-left group"><div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2"><img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" /></div><p className="text-xs text-slate-600 truncate">{p.name}</p><p className="text-sm font-semibold text-indigo-600">{fmtPrice(p.discountedPrice)}</p></button>
              })}
            </div>
          </section>
        )}
      </div>

      <section className="bg-white border-t border-slate-200 py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[{i:'M5 13l4 4L19 7',t:'Free Shipping',d:'Over ₹999'},{i:'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',t:'Easy Returns',d:'10-day policy'},{i:'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',t:'Secure Payment',d:'100% safe'},{i:'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',t:'24/7 Support',d:'Dedicated care'}].map((x,idx)=>(<div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50"><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={x.i} /></svg></div><div><h3 className="font-semibold text-slate-900 mb-1">{x.t}</h3><p className="text-sm text-slate-500">{x.d}</p></div></div>))}</div></div></section>

      <section className="bg-slate-900 py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Join the Style Circle</h2><p className="text-slate-300 mb-8 max-w-xl mx-auto">Subscribe for exclusive drops & accessory care tips.</p><form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e=>e.preventDefault()}><input type="email" placeholder="Your email" className="flex-1 px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required /><Button variant="primary" size="lg" type="submit">Subscribe</Button></form></div></section>
    </div>
  )
}