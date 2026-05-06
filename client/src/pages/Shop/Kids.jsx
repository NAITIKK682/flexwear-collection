import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

// ============================================================================
// 🎨 THEME CONSTANTS - Slate + Indigo (consistent with brand)
// ============================================================================
const THEME = {
  colors: {
    primary: 'indigo-600',
    primaryHover: 'indigo-700',
    primaryLight: 'indigo-50',
    primaryLighter: 'indigo-100',
    text: {
      primary: 'slate-900',
      secondary: 'slate-700',
      muted: 'slate-500',
      inverse: 'white'
    },
    bg: {
      primary: 'white',
      secondary: 'slate-50',
      dark: 'slate-900'
    },
    border: {
      light: 'slate-100',
      medium: 'slate-200',
      dark: 'slate-300'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out'
  }
}

// ============================================================================
// 🖼️ IMAGE PATHS CONFIGURATION - Kids Collection
// ============================================================================
const KIDS_IMAGES = {
  hero: '/images/kids/hero-banner.jpg',
  heroMobile: '/images/kids/hero-banner-mobile.jpg',
  boys: '/images/kids/boys/boy1.jpg',
  girls: '/images/kids/girls/girl1.jpg',
  baby: '/images/kids/baby/baby1.jpg',
  tshirts: '/images/kids/tshirts/tee1.jpg',
  sets: '/images/kids/sets/set1.jpg',
  shoes: '/images/kids/shoes/shoe1.jpg',
  toys: '/images/kids/toys/toy1.jpg',
  placeholder: '/images/placeholder-product.jpg'
}

// ============================================================================
// 📦 COMPREHENSIVE SAMPLE PRODUCTS DATA - Kids Collection (42+ products)
// ============================================================================
const SAMPLE_PRODUCTS = {
  // ── 1. Boys Collection ──────────────────────────────────────────────────
  boys: [
    { _id: 'kb1', name: 'Boys Cotton Polo Shirt', price: 799, discountedPrice: 599, image: KIDS_IMAGES.boys, rating: 4.6, reviews: 234, category: 'boys', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Navy', 'White', 'Red'], description: 'Classic polo for school or play', isNew: false, isBestseller: true, stock: 89, type: 'Boys' },
    { _id: 'kb2', name: 'Boys Denim Jacket', price: 1499, discountedPrice: 1199, image: KIDS_IMAGES.boys, rating: 4.8, reviews: 156, category: 'boys', sizes: ['5-6Y', '7-8Y', '9-10Y'], colors: ['Blue', 'Black'], description: 'Stylish denim jacket for cooler days', isNew: true, isBestseller: true, stock: 45, type: 'Boys' },
    { _id: 'kb3', name: 'Boys Cargo Shorts', price: 699, discountedPrice: 549, image: KIDS_IMAGES.boys, rating: 4.5, reviews: 312, category: 'boys', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Khaki', 'Olive', 'Grey'], description: 'Durable cargo shorts for active kids', isNew: false, isBestseller: true, stock: 124, type: 'Boys' },
    { _id: 'kb4', name: 'Boys Graphic Tee Pack', price: 999, discountedPrice: 799, image: KIDS_IMAGES.boys, rating: 4.4, reviews: 278, category: 'boys', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Multi', 'Blue/Grey', 'Black/White'], description: 'Pack of 3 fun graphic tees', isNew: false, isBestseller: false, stock: 67, type: 'Boys' },
    { _id: 'kb5', name: 'Boys Formal Shirt', price: 899, discountedPrice: 699, image: KIDS_IMAGES.boys, rating: 4.7, reviews: 189, category: 'boys', sizes: ['5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['White', 'Light Blue', 'Pink'], description: 'Crisp formal shirt for special occasions', isNew: false, isBestseller: true, stock: 54, type: 'Boys' },
    { _id: 'kb6', name: 'Boys Track Pants', price: 599, discountedPrice: 449, image: KIDS_IMAGES.boys, rating: 4.5, reviews: 345, category: 'boys', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Black', 'Navy', 'Grey'], description: 'Comfortable track pants for sports', isNew: true, isBestseller: false, stock: 98, type: 'Boys' },
  ],

  // ── 2. Girls Collection ─────────────────────────────────────────────────
  girls: [
    { _id: 'kg1', name: 'Girls Floral Dress', price: 999, discountedPrice: 799, image: KIDS_IMAGES.girls, rating: 4.7, reviews: 289, category: 'girls', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Pink Floral', 'Blue Floral', 'Yellow Floral'], description: 'Pretty floral dress for parties', isNew: true, isBestseller: true, stock: 76, type: 'Girls' },
    { _id: 'kg2', name: 'Girls Denim Skirt', price: 799, discountedPrice: 649, image: KIDS_IMAGES.girls, rating: 4.5, reviews: 198, category: 'girls', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Blue', 'Black', 'White'], description: 'Classic denim skirt for everyday wear', isNew: false, isBestseller: true, stock: 54, type: 'Girls' },
    { _id: 'kg3', name: 'Girls Tutu Skirt', price: 599, discountedPrice: 499, image: KIDS_IMAGES.girls, rating: 4.8, reviews: 312, category: 'girls', sizes: ['3-4Y', '5-6Y', '7-8Y'], colors: ['Pink', 'Purple', 'Black', 'White'], description: 'Magical tutu for dress-up and dance', isNew: false, isBestseller: true, stock: 87, type: 'Girls' },
    { _id: 'kg4', name: 'Girls Casual Top', price: 499, discountedPrice: 399, image: KIDS_IMAGES.girls, rating: 4.4, reviews: 234, category: 'girls', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['White', 'Pink', 'Lavender'], description: 'Soft cotton top for daily comfort', isNew: false, isBestseller: false, stock: 112, type: 'Girls' },
    { _id: 'kg5', name: 'Girls Party Frock', price: 1299, discountedPrice: 999, image: KIDS_IMAGES.girls, rating: 4.9, reviews: 167, category: 'girls', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Red', 'Gold', 'Navy'], description: 'Elegant party frock with net overlay', isNew: true, isBestseller: true, stock: 43, type: 'Girls' },
    { _id: 'kg6', name: 'Girls Leggings Pack', price: 699, discountedPrice: 549, image: KIDS_IMAGES.girls, rating: 4.6, reviews: 278, category: 'girls', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Multi', 'Black/Grey', 'Pink/Purple'], description: 'Stretchy leggings pack of 3', isNew: false, isBestseller: true, stock: 134, type: 'Girls' },
  ],

  // ── 3. Baby Essentials ──────────────────────────────────────────────────
  baby: [
    { _id: 'kbaby1', name: 'Baby Onesie Pack', price: 899, discountedPrice: 699, image: KIDS_IMAGES.baby, rating: 4.8, reviews: 412, category: 'baby', sizes: ['0-3M', '3-6M', '6-12M', '12-18M'], colors: ['Pastel Mix', 'White', 'Blue/Pink'], description: 'Soft cotton onesies for newborns', isNew: false, isBestseller: true, stock: 156, type: 'Baby' },
    { _id: 'kbaby2', name: 'Baby Romper Set', price: 799, discountedPrice: 649, image: KIDS_IMAGES.baby, rating: 4.7, reviews: 289, category: 'baby', sizes: ['0-3M', '3-6M', '6-12M'], colors: ['Yellow', 'Green', 'White'], description: 'Adorable romper with hat', isNew: true, isBestseller: true, stock: 87, type: 'Baby' },
    { _id: 'kbaby3', name: 'Baby Sleep Suit', price: 599, discountedPrice: 449, image: KIDS_IMAGES.baby, rating: 4.9, reviews: 345, category: 'baby', sizes: ['0-3M', '3-6M', '6-12M', '12-18M'], colors: ['Blue', 'Pink', 'White'], description: 'Cozy sleep suit with zipper', isNew: false, isBestseller: true, stock: 124, type: 'Baby' },
    { _id: 'kbaby4', name: 'Baby Bib Pack', price: 399, discountedPrice: 299, image: KIDS_IMAGES.baby, rating: 4.5, reviews: 234, category: 'baby', sizes: ['One Size'], colors: ['Multi', 'Pastel', 'Solid'], description: 'Absorbent cotton bibs pack of 5', isNew: false, isBestseller: false, stock: 198, type: 'Baby' },
    { _id: 'kbaby5', name: 'Baby Cap & Mittens', price: 299, discountedPrice: 249, image: KIDS_IMAGES.baby, rating: 4.6, reviews: 178, category: 'baby', sizes: ['0-6M', '6-12M'], colors: ['White', 'Blue', 'Pink'], description: 'Soft cap and mittens set', isNew: false, isBestseller: false, stock: 145, type: 'Baby' },
    { _id: 'kbaby6', name: 'Baby Winter Jacket', price: 1199, discountedPrice: 899, image: KIDS_IMAGES.baby, rating: 4.8, reviews: 156, category: 'baby', sizes: ['6-12M', '12-18M', '18-24M'], colors: ['Navy', 'Red', 'Grey'], description: 'Warm padded jacket for winter', isNew: true, isBestseller: true, stock: 67, type: 'Baby' },
  ],

  // ── 4. Kids T-Shirts ────────────────────────────────────────────────────
  tshirts: [
    { _id: 'kt1', name: 'Kids Cartoon Tee', price: 499, discountedPrice: 399, image: KIDS_IMAGES.tshirts, rating: 4.6, reviews: 312, category: 'tshirts', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Blue', 'Red', 'Green'], description: 'Fun cartoon print tee', isNew: false, isBestseller: true, stock: 145, type: 'T-Shirts' },
    { _id: 'kt2', name: 'Kids Striped Tee', price: 449, discountedPrice: 349, image: KIDS_IMAGES.tshirts, rating: 4.5, reviews: 267, category: 'tshirts', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Navy/White', 'Black/White'], description: 'Classic striped cotton tee', isNew: false, isBestseller: false, stock: 112, type: 'T-Shirts' },
    { _id: 'kt3', name: 'Kids Polo Tee', price: 599, discountedPrice: 499, image: KIDS_IMAGES.tshirts, rating: 4.7, reviews: 198, category: 'tshirts', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['White', 'Navy', 'Pink'], description: 'Smart polo for school or outings', isNew: false, isBestseller: true, stock: 89, type: 'T-Shirts' },
    { _id: 'kt4', name: 'Kids Sports Tee', price: 549, discountedPrice: 449, image: KIDS_IMAGES.tshirts, rating: 4.4, reviews: 234, category: 'tshirts', sizes: ['5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Black', 'Grey', 'Blue'], description: 'Moisture-wicking sports tee', isNew: true, isBestseller: false, stock: 98, type: 'T-Shirts' },
    { _id: 'kt5', name: 'Kids Tie-Dye Tee', price: 699, discountedPrice: 549, image: KIDS_IMAGES.tshirts, rating: 4.8, reviews: 156, category: 'tshirts', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Multi', 'Blue/Purple', 'Pink/Yellow'], description: 'Trendy tie-dye design', isNew: true, isBestseller: true, stock: 76, type: 'T-Shirts' },
    { _id: 'kt6', name: 'Kids Plain Cotton Tee', price: 399, discountedPrice: 299, image: KIDS_IMAGES.tshirts, rating: 4.5, reviews: 345, category: 'tshirts', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['White', 'Black', 'Grey', 'Navy'], description: 'Essential plain cotton tee', isNew: false, isBestseller: true, stock: 167, type: 'T-Shirts' },
  ],

  // ── 5. Kids Sets ────────────────────────────────────────────────────────
  sets: [
    { _id: 'ks1', name: 'Boys T-Shirt & Shorts Set', price: 899, discountedPrice: 699, image: KIDS_IMAGES.sets, rating: 4.7, reviews: 289, category: 'sets', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Blue/White', 'Black/Grey', 'Green/Beige'], description: 'Matching tee and shorts set', isNew: false, isBestseller: true, stock: 98, type: 'Sets' },
    { _id: 'ks2', name: 'Girls Top & Skirt Set', price: 999, discountedPrice: 799, image: KIDS_IMAGES.sets, rating: 4.8, reviews: 234, category: 'sets', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Pink/White', 'Blue/Yellow', 'Purple/Grey'], description: 'Cute coordinated outfit', isNew: true, isBestseller: true, stock: 76, type: 'Sets' },
    { _id: 'ks3', name: 'Kids Pajama Set', price: 799, discountedPrice: 649, image: KIDS_IMAGES.sets, rating: 4.9, reviews: 312, category: 'sets', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Blue Stars', 'Pink Hearts', 'Grey Animals'], description: 'Soft cotton pajama set', isNew: false, isBestseller: true, stock: 134, type: 'Sets' },
    { _id: 'ks4', name: 'Kids Track Suit', price: 1199, discountedPrice: 999, image: KIDS_IMAGES.sets, rating: 4.6, reviews: 198, category: 'sets', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'], colors: ['Black/Red', 'Navy/White', 'Grey/Blue'], description: 'Sporty track suit for active kids', isNew: false, isBestseller: false, stock: 67, type: 'Sets' },
    { _id: 'ks5', name: 'Kids Winter Set', price: 1499, discountedPrice: 1199, image: KIDS_IMAGES.sets, rating: 4.7, reviews: 156, category: 'sets', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Navy/Grey', 'Black/Red'], description: 'Hoodie and jogger winter set', isNew: true, isBestseller: true, stock: 54, type: 'Sets' },
    { _id: 'ks6', name: 'Kids Party Set', price: 1299, discountedPrice: 999, image: KIDS_IMAGES.sets, rating: 4.5, reviews: 178, category: 'sets', sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], colors: ['Blue/Gold', 'Pink/Silver'], description: 'Festive party outfit set', isNew: false, isBestseller: false, stock: 43, type: 'Sets' },
  ],

  // ── 6. Kids Shoes ───────────────────────────────────────────────────────
  shoes: [
    { _id: 'ksh1', name: 'Kids LED Sneakers', price: 1299, discountedPrice: 999, image: KIDS_IMAGES.shoes, rating: 4.8, reviews: 345, category: 'shoes', sizes: ['22', '23', '24', '25', '26', '27', '28', '29', '30'], colors: ['Black', 'Blue', 'Pink'], description: 'Light-up sneakers kids love', isNew: true, isBestseller: true, stock: 89, type: 'Shoes' },
    { _id: 'ksh2', name: 'Kids Canvas Shoes', price: 899, discountedPrice: 699, image: KIDS_IMAGES.shoes, rating: 4.6, reviews: 267, category: 'shoes', sizes: ['22', '23', '24', '25', '26', '27', '28', '29', '30'], colors: ['White', 'Black', 'Navy'], description: 'Classic canvas sneakers', isNew: false, isBestseller: true, stock: 112, type: 'Shoes' },
    { _id: 'ksh3', name: 'Kids Sandals', price: 799, discountedPrice: 649, image: KIDS_IMAGES.shoes, rating: 4.5, reviews: 198, category: 'shoes', sizes: ['22', '23', '24', '25', '26', '27', '28', '29', '30'], colors: ['Blue', 'Pink', 'Black'], description: 'Comfortable summer sandals', isNew: false, isBestseller: false, stock: 98, type: 'Shoes' },
    { _id: 'ksh4', name: 'Kids Sports Shoes', price: 1499, discountedPrice: 1199, image: KIDS_IMAGES.shoes, rating: 4.7, reviews: 234, category: 'shoes', sizes: ['23', '24', '25', '26', '27', '28', '29', '30'], colors: ['Black/Red', 'Blue/White', 'Grey/Orange'], description: 'Supportive sports shoes', isNew: false, isBestseller: true, stock: 76, type: 'Shoes' },
    { _id: 'ksh5', name: 'Kids School Shoes', price: 999, discountedPrice: 799, image: KIDS_IMAGES.shoes, rating: 4.8, reviews: 312, category: 'shoes', sizes: ['22', '23', '24', '25', '26', '27', '28', '29', '30'], colors: ['Black', 'Brown'], description: 'Durable black school shoes', isNew: false, isBestseller: true, stock: 134, type: 'Shoes' },
    { _id: 'ksh6', name: 'Kids Winter Boots', price: 1699, discountedPrice: 1399, image: KIDS_IMAGES.shoes, rating: 4.9, reviews: 156, category: 'shoes', sizes: ['22', '23', '24', '25', '26', '27', '28', '29', '30'], colors: ['Black', 'Brown', 'Navy'], description: 'Warm waterproof winter boots', isNew: true, isBestseller: false, stock: 54, type: 'Shoes' },
  ],

  // ── 7. Kids Toys & Accessories ──────────────────────────────────────────
  toys: [
    { _id: 'ktoy1', name: 'Kids Backpack', price: 899, discountedPrice: 699, image: KIDS_IMAGES.toys, rating: 4.7, reviews: 289, category: 'toys', sizes: ['Small', 'Medium', 'Large'], colors: ['Blue', 'Pink', 'Green', 'Black'], description: 'Fun character backpack for school', isNew: false, isBestseller: true, stock: 98, type: 'Accessories' },
    { _id: 'ktoy2', name: 'Kids Water Bottle', price: 399, discountedPrice: 299, image: KIDS_IMAGES.toys, rating: 4.5, reviews: 234, category: 'toys', sizes: ['400ml', '500ml', '750ml'], colors: ['Blue', 'Pink', 'Green', 'Purple'], description: 'Leak-proof kids water bottle', isNew: false, isBestseller: true, stock: 156, type: 'Accessories' },
    { _id: 'ktoy3', name: 'Kids Sunglasses', price: 499, discountedPrice: 399, image: KIDS_IMAGES.toys, rating: 4.6, reviews: 178, category: 'toys', sizes: ['One Size'], colors: ['Blue', 'Pink', 'Black', 'Red'], description: 'UV protection kids sunglasses', isNew: true, isBestseller: false, stock: 87, type: 'Accessories' },
    { _id: 'ktoy4', name: 'Kids Cap/Hat', price: 349, discountedPrice: 279, image: KIDS_IMAGES.toys, rating: 4.4, reviews: 198, category: 'toys', sizes: ['S', 'M', 'L'], colors: ['Navy', 'Black', 'Red', 'White'], description: 'Adjustable kids cap', isNew: false, isBestseller: false, stock: 124, type: 'Accessories' },
    { _id: 'ktoy5', name: 'Kids Lunch Box', price: 599, discountedPrice: 499, image: KIDS_IMAGES.toys, rating: 4.8, reviews: 267, category: 'toys', sizes: ['Single', 'Double', 'Triple'], colors: ['Blue', 'Pink', 'Green', 'Purple'], description: 'Compartmentalized lunch box', isNew: true, isBestseller: true, stock: 112, type: 'Accessories' },
    { _id: 'ktoy6', name: 'Kids Wallet/Purse', price: 449, discountedPrice: 349, image: KIDS_IMAGES.toys, rating: 4.5, reviews: 156, category: 'toys', sizes: ['One Size'], colors: ['Blue', 'Pink', 'Black', 'Rainbow'], description: 'Cute kids wallet with zipper', isNew: false, isBestseller: false, stock: 98, type: 'Accessories' },
  ]
}

// ============================================================================
// 🧭 SECTION CONFIGURATION - Kids Collection
// ============================================================================
const SECTIONS = [
  { id: 'boys', title: 'Boys Collection', subtitle: 'Cool & comfortable styles', description: 'Trendy outfits for active boys', bgColor: 'from-indigo-50 to-white', showViewAll: true },
  { id: 'girls', title: 'Girls Collection', subtitle: 'Pretty & playful designs', description: 'Adorable outfits for little fashionistas', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'baby', title: 'Baby Essentials', subtitle: 'Soft & safe for newborns', description: 'Gentle fabrics for delicate skin', bgColor: 'from-indigo-50 to-white', showViewAll: true },
  { id: 'tshirts', title: 'Kids T-Shirts', subtitle: 'Fun prints & everyday comfort', description: 'Graphic, plain & striped tees', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'sets', title: 'Matching Sets', subtitle: 'Coordinated outfits', description: 'Easy mix & match sets', bgColor: 'from-indigo-50 to-white', showViewAll: true },
  { id: 'shoes', title: 'Kids Shoes', subtitle: 'Sneakers, sandals & boots', description: 'Supportive footwear for growing feet', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'toys', title: 'Toys & Accessories', subtitle: 'Backpacks, bottles & more', description: 'Essential gear for kids', bgColor: 'from-indigo-50 to-white', showViewAll: true },
]

// ============================================================================
// 🎨 UTILITY FUNCTIONS
// ============================================================================
const calculateDiscount = (price, discountedPrice) => {
  if (!price || !discountedPrice || price === discountedPrice) return 0
  return Math.round(((price - discountedPrice) / price) * 100)
}

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

const StarRating = ({ rating, size = 'sm' }) => {
  const sizeClasses = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ============================================================================
// 🧩 REUSABLE UI COMPONENTS (Memoized for Performance)
// ============================================================================

// ── Badge Component ───────────────────────────────────────────────────────
const Badge = memo(({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white',
    secondary: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    outline: 'border border-slate-200 text-slate-600'
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>
})
Badge.displayName = 'Badge'

// ── Button Component ──────────────────────────────────────────────────────
const Button = memo(({ children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled = false, onClick, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 active:scale-95',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500'
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base', xl: 'px-9 py-4 text-lg' }
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
      {children}
    </button>
  )
})
Button.displayName = 'Button'

// ── Product Card Component ────────────────────────────────────────────────
const ProductCard = memo(({ product, onAddToCart, onQuickView, onWishlist, isAdding, isInWishlist }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const discount = calculateDiscount(product.price, product.discountedPrice)
  
  const handleImageLoad = useCallback(() => setImageLoaded(true), [])
  const handleAddToCart = useCallback((e) => { e.stopPropagation(); onAddToCart?.(product) }, [product, onAddToCart])
  const handleQuickView = useCallback((e) => { e.stopPropagation(); onQuickView?.(product) }, [product, onQuickView])
  const handleWishlist = useCallback((e) => { e.stopPropagation(); onWishlist?.(product) }, [product, onWishlist])

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} role="article" aria-labelledby={`product-${product._id}`}>
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" aria-hidden="true" />}
        <img src={product.image || KIDS_IMAGES.placeholder} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} loading="lazy" onLoad={handleImageLoad} onError={handleImageLoad} />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="primary">New</Badge>}
          {product.isBestseller && <Badge variant="warning">Bestseller</Badge>}
          {discount > 0 && <Badge variant="success">-{discount}%</Badge>}
          {product.stock < 20 && product.stock > 0 && <Badge variant="warning">Low Stock</Badge>}
          {product.stock === 0 && <Badge variant="secondary">Out of Stock</Badge>}
        </div>
        <div className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button variant="primary" size="sm" fullWidth onClick={handleAddToCart} disabled={isAdding || product.stock === 0} loading={isAdding} className="flex-1">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <button onClick={handleQuickView} className="p-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors" aria-label={`Quick view ${product.name}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
          <button onClick={handleWishlist} className={`p-2.5 rounded-xl border transition-colors ${isInWishlist ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'}`} aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isInWishlist}>
            <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
        <button onClick={handleWishlist} className="absolute top-3 right-3 lg:hidden w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm" aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
          <svg className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-slate-400'}`} viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>
      <div className="p-4">
        {product.type && <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{product.type}</p>}
        <h3 id={`product-${product._id}`} className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3"><StarRating rating={product.rating} size="xs" /><span className="text-xs text-slate-400">({product.reviews})</span></div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-indigo-600">{formatPrice(product.discountedPrice)}</span>
          {discount > 0 && <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>}
        </div>
        {product.sizes?.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-2">Sizes:</span>
            {product.sizes.slice(0, 4).map(size => <span key={size} className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{size}</span>)}
            {product.sizes.length > 4 && <span className="text-xs text-slate-400">+{product.sizes.length - 4}</span>}
          </div>
        )}
      </div>
    </article>
  )
})
ProductCard.displayName = 'ProductCard'

// ── Filter Sidebar Component ──────────────────────────────────────────────
const FilterSidebar = memo(({ filters, setFilters, isOpen, onClose, onApply }) => {
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: 99999 },
  ]
  const sizes = ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '0-6M', '6-12M', '12-18M', '22', '23', '24', '25', '26', '27', '28', '29', '30']
  const colors = ['Black', 'White', 'Blue', 'Pink', 'Red', 'Green', 'Yellow', 'Grey', 'Navy', 'Purple']

  const handlePriceChange = useCallback((min, max) => setFilters(prev => ({ ...prev, priceRange: [min, max] })), [setFilters])
  const handleSizeToggle = useCallback((size) => setFilters(prev => ({ ...prev, sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size] })), [setFilters])
  const handleColorToggle = useCallback((color) => setFilters(prev => ({ ...prev, colors: prev.colors.includes(color) ? prev.colors.filter(c => c !== color) : [...prev.colors, color] })), [setFilters])
  const handleClearAll = useCallback(() => { setFilters({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest', inStock: false, onSale: false }); onApply?.() }, [setFilters, onApply])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 99999) count++
    if (filters.sizes.length > 0) count++
    if (filters.colors.length > 0) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    return count
  }, [filters])

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} aria-hidden="true" />}
      <aside className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-72 bg-white lg:bg-transparent border-r lg:border-r-0 border-slate-200 transform transition-transform duration-300 ease-in-out z-50 lg:z-auto lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto lg:overflow-visible flex flex-col`} aria-label="Product filters">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 lg:hidden">
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Close filters"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 p-4 lg:p-0 space-y-6 lg:space-y-8">
          {activeFiltersCount > 0 && (
            <div className="lg:hidden p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-700 font-medium">{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active</span>
                <button onClick={handleClearAll} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Clear all</button>
              </div>
            </div>
          )}
          <section>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range, idx) => {
                const isActive = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                return (
                  <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'}`}>
                    <input type="radio" name="price" checked={isActive} onChange={() => handlePriceChange(range.min, range.max)} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <span className={`text-sm ${isActive ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>{range.label}</span>
                  </label>
                )
              })}
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => {
                const isSelected = filters.sizes.includes(size)
                return (
                  <button key={size} onClick={() => handleSizeToggle(size)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'}`} aria-pressed={isSelected}>{size}</button>
                )
              })}
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>Color</h3>
            <div className="space-y-2">
              {colors.map(color => {
                const isSelected = filters.colors.includes(color)
                return (
                  <label key={color} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleColorToggle(color)} className="sr-only" />
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isSelected ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}`} style={{ backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() === 'black' ? '#0f172a' : color.toLowerCase() === 'blue' ? '#3b82f6' : color.toLowerCase() === 'pink' ? '#ec4899' : color.toLowerCase() === 'red' ? '#ef4444' : color.toLowerCase() === 'green' ? '#22c55e' : color.toLowerCase() === 'yellow' ? '#eab308' : color.toLowerCase() === 'grey' ? '#6b7280' : color.toLowerCase() === 'navy' ? '#1e3a8a' : color.toLowerCase() === 'purple' ? '#a855f7' : '#94a3b8', border: color.toLowerCase() === 'white' ? '1px solid #e2e8f0' : 'none' }} />
                    <span className={`text-sm ${isSelected ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>{color}</span>
                  </label>
                )
              })}
            </div>
          </section>
          <section className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" /><span className="text-sm text-slate-600 group-hover:text-slate-900">In Stock Only</span></label>
            <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" checked={filters.onSale} onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" /><span className="text-sm text-slate-600 group-hover:text-slate-900">On Sale</span></label>
          </section>
          <Button variant="ghost" size="sm" fullWidth onClick={handleClearAll} className="lg:hidden">Clear All Filters</Button>
        </div>
        <div className="p-4 border-t border-slate-200 lg:hidden">
          <Button variant="primary" fullWidth onClick={() => { onApply?.(); onClose() }}>Apply Filters ({activeFiltersCount})</Button>
        </div>
      </aside>
    </>
  )
})
FilterSidebar.displayName = 'FilterSidebar'

// ── Section Header Component ──────────────────────────────────────────────
const SectionHeader = memo(({ section, onViewAll }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{section.title}</h2>
      <p className="text-slate-500 text-sm sm:text-base">{section.subtitle}</p>
      {section.description && <p className="text-slate-400 text-sm mt-1 hidden sm:block">{section.description}</p>}
    </div>
    {section.showViewAll && onViewAll && (
      <Link to={`/shop/${section.id}`} onClick={onViewAll} className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition-colors group">
        View All
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Link>
    )}
  </div>
))
SectionHeader.displayName = 'SectionHeader'

// ============================================================================
// 🎯 MAIN KIDS PAGE COMPONENT
// ============================================================================
export default function Kids() {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  
  const [products] = useState(SAMPLE_PRODUCTS)
  const [filters, setFilters] = useState({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest', inStock: false, onSale: false })
  const [addingId, setAddingId] = useState(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [wishlist, setWishlist] = useState(() => { try { return JSON.parse(localStorage.getItem('wishlist') || '[]') } catch { return [] } })
  const [viewedProducts, setViewedProducts] = useState(() => { try { return JSON.parse(localStorage.getItem('viewedProducts') || '[]') } catch { return [] } })
  const sectionRefs = useRef({})

  useEffect(() => { try { localStorage.setItem('wishlist', JSON.stringify(wishlist)) } catch (e) {} }, [wishlist])
  useEffect(() => { try { localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts.slice(-20))) } catch (e) {} }, [viewedProducts])

  const handleAddToCart = useCallback(async (product) => {
    if (addingId === product._id) return
    try {
      setAddingId(product._id)
      if (!viewedProducts.includes(product._id)) setViewedProducts(prev => [...prev, product._id])
      await addToCart({ ...product, quantity: 1, addedAt: new Date().toISOString() })
      toast.success(<div className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span>Added "{product.name}" to cart</span></div>, { duration: 3000, position: 'bottom-right' })
    } catch (err) { toast.error('Failed to add to cart') }
    finally { setTimeout(() => setAddingId(null), 500) }
  }, [addToCart, addingId, viewedProducts])

  const handleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.includes(product._id)
      toast(exists ? 'Removed from wishlist' : 'Added to wishlist', { duration: 2000, position: 'bottom-right', icon: exists ? '❤️' : '💙' })
      return exists ? prev.filter(id => id !== product._id) : [...prev, product._id]
    })
  }, [])

  const handleQuickView = useCallback((product) => {
    if (!viewedProducts.includes(product._id)) setViewedProducts(prev => [...prev, product._id])
    navigate(`/product/${product._id}`, { state: { from: '/kids' } })
  }, [navigate, viewedProducts])

  const filterProducts = useCallback((categoryProducts) => {
    return categoryProducts.filter(product => {
      const priceMatch = product.discountedPrice >= filters.priceRange[0] && product.discountedPrice <= filters.priceRange[1]
      const sizeMatch = filters.sizes.length === 0 || filters.sizes.some(size => product.sizes?.includes(size))
      const colorMatch = filters.colors.length === 0 || filters.colors.some(color => product.colors?.some(c => c.toLowerCase().includes(color.toLowerCase())))
      const stockMatch = !filters.inStock || product.stock > 0
      const saleMatch = !filters.onSale || product.discountedPrice < product.price
      return priceMatch && sizeMatch && colorMatch && stockMatch && saleMatch
    })
  }, [filters])

  const sortProducts = useCallback((categoryProducts) => {
    const sorted = [...categoryProducts]
    switch (filters.sortBy) {
      case 'price-low': return sorted.sort((a, b) => a.discountedPrice - b.discountedPrice)
      case 'price-high': return sorted.sort((a, b) => b.discountedPrice - a.discountedPrice)
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating)
      default: return sorted.sort((a, b) => { if (a.isNew && !b.isNew) return -1; if (!a.isNew && b.isNew) return 1; if (a.isBestseller && !b.isBestseller) return -1; if (!a.isBestseller && b.isBestseller) return 1; return 0 })
    }
  }, [filters.sortBy])

  const processedProducts = useMemo(() => {
    const result = {}
    Object.entries(products).forEach(([key, items]) => { result[key] = sortProducts(filterProducts(items)) })
    return result
  }, [products, filters, filterProducts, sortProducts])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[500px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden" aria-label="Kids collection hero">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-50" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-white/90 text-indigo-600">Kids Collection 2024</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">Kids Collection</h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Fun, comfortable, and durable clothing for kids of all ages. Shop the latest styles!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#shop" className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Shop Now</a>
            <Button variant="secondary" size="lg" onClick={() => sectionRefs.current['boys']?.scrollIntoView({ behavior: 'smooth' })}>Explore Categories</Button>
          </div>
        </div>
        <a href="#shop" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 hover:text-white transition-colors" aria-label="Scroll to products">
          <span className="text-xs mb-2">Scroll</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </a>
      </section>

      {/* Main Content */}
      <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex mb-4 sm:mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 sm:gap-2">
            <li><Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
            <li><svg className="w-4 h-4 mx-1 sm:mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></li>
            <li><Link to="/kids" className="hover:text-indigo-600 transition-colors">Kids</Link></li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-sm" aria-label="Open filters">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            <span className="font-medium">Filters</span>
            {(filters.sizes.length > 0 || filters.colors.length > 0 || filters.inStock || filters.onSale) && <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">{filters.sizes.length + filters.colors.length + (filters.inStock ? 1 : 0) + (filters.onSale ? 1 : 0)}</span>}
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <label htmlFor="sort-select" className="text-sm text-slate-600 hidden sm:block">Sort by:</label>
            <select id="sort-select" value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm" aria-label="Sort products">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1"><div className="lg:sticky lg:top-24"><FilterSidebar filters={filters} setFilters={setFilters} isOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} onApply={() => {}} /></div></div>
          <div className="lg:col-span-3 space-y-12 lg:space-y-16">
            {SECTIONS.map(section => {
              const sectionProducts = processedProducts[section.id] || []
              const hasProducts = sectionProducts.length > 0
              return (
                <section key={section.id} id={section.id} ref={el => sectionRefs.current[section.id] = el} className={`scroll-mt-24 ${section.bgColor ? `bg-gradient-to-b ${section.bgColor}` : ''} rounded-3xl p-6 sm:p-8`} aria-labelledby={`${section.id}-heading`}>
                  <SectionHeader section={section} onViewAll={() => navigate(`/shop/${section.id}`)} />
                  {hasProducts ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {sectionProducts.map(product => (
                        <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onQuickView={handleQuickView} onWishlist={handleWishlist} isAdding={addingId === product._id} isInWishlist={wishlist.includes(product._id)} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                      <p className="text-slate-500 mb-4">No products match your filters</p>
                      <Button variant="ghost" onClick={() => setFilters({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest', inStock: false, onSale: false })}>Clear Filters</Button>
                    </div>
                  )}
                  {hasProducts && sectionProducts.length >= 4 && section.showViewAll && (
                    <div className="mt-8 text-center">
                      <Button variant="outline" size="md" onClick={() => navigate(`/shop/${section.id}`)}>View All {section.title}</Button>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </div>

        {/* Recently Viewed */}
        {viewedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {viewedProducts.slice(-6).reverse().map(productId => {
                let product = null
                for (const category of Object.values(SAMPLE_PRODUCTS)) {
                  const found = category.find(p => p._id === productId)
                  if (found) { product = found; break }
                }
                if (!product) return null
                return (
                  <button key={productId} onClick={() => navigate(`/product/${productId}`)} className="text-left group">
                    <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                    <p className="text-xs text-slate-600 truncate">{product.name}</p>
                    <p className="text-sm font-semibold text-indigo-600">{formatPrice(product.discountedPrice)}</p>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* Trust Badges */}
      <section className="bg-white border-t border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: 'M5 13l4 4L19 7', title: 'Free Shipping', description: 'On orders over ₹999' },
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Easy Returns', description: '10-day return policy' },
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Secure Payment', description: '100% secure checkout' },
              { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: '24/7 Support', description: 'Dedicated customer care' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <div><h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3><p className="text-sm text-slate-500">{item.description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-slate-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Join the Flexwear Kids Club</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Subscribe for exclusive kids fashion drops, parenting tips, and special offers.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            <Button variant="primary" size="lg" type="submit">Subscribe</Button>
          </form>
          <p className="text-xs text-slate-500 mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
      </section>
    </div>
  )
}