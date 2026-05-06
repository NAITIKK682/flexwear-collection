import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

// ============================================================================
// 🎨 THEME CONSTANTS - Only slate + indigo colors (no unused colors)
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
// 🖼️ IMAGE PATHS CONFIGURATION
// ============================================================================
const MEN_IMAGES = {
  hero: '/images/men/hero-banner.jpg',
  heroMobile: '/images/men/hero-banner-mobile.jpg',
  tshirts: '/images/men/tshirts/tshirt1.jpg',
  shirts: '/images/men/shirts/shirt1.jpg',
  jeans: '/images/men/jeans/jeans1.jpg',
  jackets: '/images/men/jackets/jacket1.jpg',
  trousers: '/images/men/trousers/trouser1.jpg',
  shoes: '/images/men/shoes/shoe1.jpg',
  newArrivals: '/images/men/new/new1.jpg',
  placeholder: '/images/placeholder-product.jpg'
}

// ============================================================================
// 📦 COMPREHENSIVE SAMPLE PRODUCTS DATA (28+ products across 7 categories)
// ============================================================================
const SAMPLE_PRODUCTS = {
  // ── New Arrivals ─────────────────────────────────────────────────────────
  newArrivals: [
    { 
      _id: 'n1', 
      name: 'New Arrival Premium Tee', 
      price: 999, 
      discountedPrice: 799, 
      image: MEN_IMAGES.newArrivals, 
      rating: 4.6, 
      reviews: 128,
      category: 'new',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy'],
      description: 'Premium cotton blend tee with modern fit',
      isNew: true,
      isBestseller: false,
      stock: 45
    },
    { 
      _id: 'n2', 
      name: 'Limited Edition Hoodie', 
      price: 2499, 
      discountedPrice: 1999, 
      image: MEN_IMAGES.newArrivals, 
      rating: 4.8, 
      reviews: 256,
      category: 'new',
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Grey', 'Navy'],
      description: 'Cozy fleece hoodie with embroidered logo',
      isNew: true,
      isBestseller: true,
      stock: 23
    },
    { 
      _id: 'n3', 
      name: 'Summer Collection Shirt', 
      price: 1599, 
      discountedPrice: 1299, 
      image: MEN_IMAGES.newArrivals, 
      rating: 4.5, 
      reviews: 89,
      category: 'new',
      sizes: ['S', 'M', 'L'],
      colors: ['White', 'Blue', 'Beige'],
      description: 'Lightweight linen shirt perfect for summer',
      isNew: true,
      isBestseller: false,
      stock: 67
    },
    { 
      _id: 'n4', 
      name: 'Trendy Joggers Pro', 
      price: 1799, 
      discountedPrice: 1499, 
      image: MEN_IMAGES.newArrivals, 
      rating: 4.7, 
      reviews: 178,
      category: 'new',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Grey', 'Navy'],
      description: 'Performance joggers with moisture-wicking fabric',
      isNew: true,
      isBestseller: true,
      stock: 34
    },
    { 
      _id: 'n5', 
      name: 'Urban Bomber Jacket', 
      price: 3299, 
      discountedPrice: 2799, 
      image: MEN_IMAGES.newArrivals, 
      rating: 4.9, 
      reviews: 312,
      category: 'new',
      sizes: ['M', 'L', 'XL'],
      colors: ['Black', 'Olive', 'Navy'],
      description: 'Stylish bomber jacket with premium finish',
      isNew: true,
      isBestseller: true,
      stock: 18
    },
    { 
      _id: 'n6', 
      name: 'Essential Crew Neck', 
      price: 699, 
      discountedPrice: 549, 
      image: MEN_IMAGES.newArrivals, 
      rating: 4.4, 
      reviews: 203,
      category: 'new',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Grey', 'Navy'],
      description: 'Everyday essential crew neck tee',
      isNew: true,
      isBestseller: false,
      stock: 89
    },
  ],

  // ── T-Shirts ────────────────────────────────────────────────────────────
  tshirts: [
    { 
      _id: 't1', 
      name: 'Basic Cotton T-Shirt', 
      price: 599, 
      discountedPrice: 499, 
      image: MEN_IMAGES.tshirts, 
      rating: 4.5, 
      reviews: 456,
      category: 'tshirts',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Grey', 'Navy', 'Olive'],
      description: '100% cotton basic tee for everyday wear',
      isNew: false,
      isBestseller: true,
      stock: 156
    },
    { 
      _id: 't2', 
      name: 'Oversized Graphic Tee', 
      price: 899, 
      discountedPrice: 699, 
      image: MEN_IMAGES.tshirts, 
      rating: 4.7, 
      reviews: 289,
      category: 'tshirts',
      sizes: ['M', 'L', 'XL'],
      colors: ['Black', 'White'],
      description: 'Trendy oversized fit with bold graphics',
      isNew: false,
      isBestseller: true,
      stock: 78
    },
    { 
      _id: 't3', 
      name: 'Printed Crew Neck', 
      price: 799, 
      discountedPrice: 599, 
      image: MEN_IMAGES.tshirts, 
      rating: 4.3, 
      reviews: 167,
      category: 'tshirts',
      sizes: ['S', 'M', 'L'],
      colors: ['White', 'Blue', 'Red'],
      description: 'Creative printed design on premium cotton',
      isNew: false,
      isBestseller: false,
      stock: 92
    },
    { 
      _id: 't4', 
      name: 'Premium Polo T-Shirt', 
      price: 1199, 
      discountedPrice: 999, 
      image: MEN_IMAGES.tshirts, 
      rating: 4.8, 
      reviews: 334,
      category: 'tshirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Navy', 'Black', 'White', 'Burgundy'],
      description: 'Classic polo with modern tailoring',
      isNew: false,
      isBestseller: true,
      stock: 64
    },
    { 
      _id: 't5', 
      name: 'V-Neck Essential', 
      price: 649, 
      discountedPrice: 529, 
      image: MEN_IMAGES.tshirts, 
      rating: 4.4, 
      reviews: 198,
      category: 'tshirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Grey'],
      description: 'Comfortable v-neck for layered looks',
      isNew: false,
      isBestseller: false,
      stock: 112
    },
    { 
      _id: 't6', 
      name: 'Striped Casual Tee', 
      price: 749, 
      discountedPrice: 599, 
      image: MEN_IMAGES.tshirts, 
      rating: 4.6, 
      reviews: 223,
      category: 'tshirts',
      sizes: ['M', 'L', 'XL'],
      colors: ['Navy/White', 'Black/White'],
      description: 'Classic stripes with relaxed fit',
      isNew: false,
      isBestseller: false,
      stock: 87
    },
  ],

  // ── Shirts ──────────────────────────────────────────────────────────────
  shirts: [
    { 
      _id: 's1', 
      name: 'Formal Oxford Shirt', 
      price: 1499, 
      discountedPrice: 1199, 
      image: MEN_IMAGES.shirts, 
      rating: 4.6, 
      reviews: 412,
      category: 'shirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Blue', 'Pink'],
      description: 'Classic oxford weave for professional look',
      isNew: false,
      isBestseller: true,
      stock: 73
    },
    { 
      _id: 's2', 
      name: 'Casual Linen Shirt', 
      price: 1299, 
      discountedPrice: 999, 
      image: MEN_IMAGES.shirts, 
      rating: 4.4, 
      reviews: 189,
      category: 'shirts',
      sizes: ['M', 'L', 'XL'],
      colors: ['White', 'Beige', 'Light Blue'],
      description: 'Breathable linen for warm weather',
      isNew: false,
      isBestseller: false,
      stock: 56
    },
    { 
      _id: 's3', 
      name: 'Slim Fit Dress Shirt', 
      price: 1699, 
      discountedPrice: 1399, 
      image: MEN_IMAGES.shirts, 
      rating: 4.7, 
      reviews: 298,
      category: 'shirts',
      sizes: ['S', 'M', 'L'],
      colors: ['White', 'Black', 'Navy'],
      description: 'Tailored slim fit for sharp appearance',
      isNew: false,
      isBestseller: true,
      stock: 41
    },
    { 
      _id: 's4', 
      name: 'Denim Casual Shirt', 
      price: 1399, 
      discountedPrice: 1099, 
      image: MEN_IMAGES.shirts, 
      rating: 4.5, 
      reviews: 267,
      category: 'shirts',
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Light Blue', 'Dark Blue'],
      description: 'Versatile denim shirt for casual outings',
      isNew: false,
      isBestseller: false,
      stock: 68
    },
    { 
      _id: 's5', 
      name: 'Flannel Check Shirt', 
      price: 1199, 
      discountedPrice: 949, 
      image: MEN_IMAGES.shirts, 
      rating: 4.6, 
      reviews: 178,
      category: 'shirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Red/Black', 'Blue/Grey'],
      description: 'Cozy flannel with classic check pattern',
      isNew: false,
      isBestseller: false,
      stock: 94
    },
    { 
      _id: 's6', 
      name: 'Short Sleeve Resort', 
      price: 999, 
      discountedPrice: 799, 
      image: MEN_IMAGES.shirts, 
      rating: 4.3, 
      reviews: 134,
      category: 'shirts',
      sizes: ['M', 'L', 'XL'],
      colors: ['White', 'Coral', 'Mint'],
      description: 'Vacation-ready short sleeve shirt',
      isNew: false,
      isBestseller: false,
      stock: 82
    },
  ],

  // ── Jeans ───────────────────────────────────────────────────────────────
  jeans: [
    { 
      _id: 'j1', 
      name: 'Slim Fit Dark Jeans', 
      price: 1999, 
      discountedPrice: 1599, 
      image: MEN_IMAGES.jeans, 
      rating: 4.6, 
      reviews: 523,
      category: 'jeans',
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Dark Blue', 'Black'],
      description: 'Classic slim fit with stretch comfort',
      isNew: false,
      isBestseller: true,
      stock: 89
    },
    { 
      _id: 'j2', 
      name: 'Regular Fit Blue Jeans', 
      price: 1799, 
      discountedPrice: 1499, 
      image: MEN_IMAGES.jeans, 
      rating: 4.4, 
      reviews: 367,
      category: 'jeans',
      sizes: ['30', '32', '34', '36', '38'],
      colors: ['Medium Blue', 'Light Blue'],
      description: 'Comfortable regular fit for all-day wear',
      isNew: false,
      isBestseller: true,
      stock: 124
    },
    { 
      _id: 'j3', 
      name: 'Baggy Street Jeans', 
      price: 2199, 
      discountedPrice: 1799, 
      image: MEN_IMAGES.jeans, 
      rating: 4.5, 
      reviews: 198,
      category: 'jeans',
      sizes: ['30', '32', '34'],
      colors: ['Black', 'Grey', 'Blue'],
      description: 'Trendy baggy fit with street style',
      isNew: false,
      isBestseller: false,
      stock: 56
    },
    { 
      _id: 'j4', 
      name: 'Ripped Skinny Jeans', 
      price: 2299, 
      discountedPrice: 1899, 
      image: MEN_IMAGES.jeans, 
      rating: 4.3, 
      reviews: 245,
      category: 'jeans',
      sizes: ['28', '30', '32'],
      colors: ['Black', 'Blue'],
      description: 'Edgy ripped details with skinny fit',
      isNew: false,
      isBestseller: false,
      stock: 43
    },
    { 
      _id: 'j5', 
      name: 'Straight Leg Classic', 
      price: 1899, 
      discountedPrice: 1549, 
      image: MEN_IMAGES.jeans, 
      rating: 4.7, 
      reviews: 412,
      category: 'jeans',
      sizes: ['30', '32', '34', '36'],
      colors: ['Dark Blue', 'Black', 'Grey'],
      description: 'Timeless straight leg for versatile styling',
      isNew: false,
      isBestseller: true,
      stock: 97
    },
    { 
      _id: 'j6', 
      name: 'Tapered Modern Fit', 
      price: 2099, 
      discountedPrice: 1699, 
      image: MEN_IMAGES.jeans, 
      rating: 4.6, 
      reviews: 289,
      category: 'jeans',
      sizes: ['28', '30', '32', '34'],
      colors: ['Blue', 'Black'],
      description: 'Modern tapered cut with premium denim',
      isNew: false,
      isBestseller: false,
      stock: 71
    },
  ],

  // ── Jackets & Hoodies ───────────────────────────────────────────────────
  jackets: [
    { 
      _id: 'jk1', 
      name: 'Denim Jacket Classic', 
      price: 2999, 
      discountedPrice: 2499, 
      image: MEN_IMAGES.jackets, 
      rating: 4.7, 
      reviews: 378,
      category: 'jackets',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black'],
      description: 'Iconic denim jacket with vintage wash',
      isNew: false,
      isBestseller: true,
      stock: 52
    },
    { 
      _id: 'jk2', 
      name: 'Bomber Jacket Pro', 
      price: 3499, 
      discountedPrice: 2999, 
      image: MEN_IMAGES.jackets, 
      rating: 4.8, 
      reviews: 456,
      category: 'jackets',
      sizes: ['M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Olive'],
      description: 'Premium bomber with quilted lining',
      isNew: false,
      isBestseller: true,
      stock: 38
    },
    { 
      _id: 'jk3', 
      name: 'Hooded Sweatshirt', 
      price: 1999, 
      discountedPrice: 1599, 
      image: MEN_IMAGES.jackets, 
      rating: 4.6, 
      reviews: 523,
      category: 'jackets',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Grey', 'Navy', 'Burgundy'],
      description: 'Cozy fleece hoodie for everyday comfort',
      isNew: false,
      isBestseller: true,
      stock: 145
    },
    { 
      _id: 'jk4', 
      name: 'Leather Jacket Premium', 
      price: 5999, 
      discountedPrice: 4999, 
      image: MEN_IMAGES.jackets, 
      rating: 4.9, 
      reviews: 189,
      category: 'jackets',
      sizes: ['M', 'L', 'XL'],
      colors: ['Black', 'Brown'],
      description: 'Genuine leather jacket with premium finish',
      isNew: false,
      isBestseller: true,
      stock: 21
    },
    { 
      _id: 'jk5', 
      name: 'Windbreaker Lightweight', 
      price: 2299, 
      discountedPrice: 1899, 
      image: MEN_IMAGES.jackets, 
      rating: 4.5, 
      reviews: 267,
      category: 'jackets',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Navy', 'Black', 'Grey'],
      description: 'Packable windbreaker for active lifestyle',
      isNew: false,
      isBestseller: false,
      stock: 84
    },
    { 
      _id: 'jk6', 
      name: 'Puffer Jacket Winter', 
      price: 4299, 
      discountedPrice: 3599, 
      image: MEN_IMAGES.jackets, 
      rating: 4.8, 
      reviews: 312,
      category: 'jackets',
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy', 'Olive'],
      description: 'Insulated puffer for cold weather protection',
      isNew: false,
      isBestseller: true,
      stock: 47
    },
  ],

  // ── Trousers & Joggers ──────────────────────────────────────────────────
  trousers: [
    { 
      _id: 'tr1', 
      name: 'Formal Trousers Elite', 
      price: 1899, 
      discountedPrice: 1499, 
      image: MEN_IMAGES.trousers, 
      rating: 4.5, 
      reviews: 298,
      category: 'trousers',
      sizes: ['30', '32', '34', '36'],
      colors: ['Black', 'Navy', 'Grey'],
      description: 'Sharp formal trousers with crease-resistant fabric',
      isNew: false,
      isBestseller: true,
      stock: 76
    },
    { 
      _id: 'tr2', 
      name: 'Chino Pants Classic', 
      price: 1699, 
      discountedPrice: 1299, 
      image: MEN_IMAGES.trousers, 
      rating: 4.4, 
      reviews: 367,
      category: 'trousers',
      sizes: ['30', '32', '34', '36', '38'],
      colors: ['Beige', 'Navy', 'Olive', 'Black'],
      description: 'Versatile chinos for smart-casual looks',
      isNew: false,
      isBestseller: true,
      stock: 103
    },
    { 
      _id: 'tr3', 
      name: 'Joggers Performance', 
      price: 1499, 
      discountedPrice: 1199, 
      image: MEN_IMAGES.trousers, 
      rating: 4.6, 
      reviews: 445,
      category: 'trousers',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Grey', 'Navy'],
      description: 'Athletic joggers with moisture-wicking tech',
      isNew: false,
      isBestseller: true,
      stock: 128
    },
    { 
      _id: 'tr4', 
      name: 'Cargo Pants Utility', 
      price: 1999, 
      discountedPrice: 1599, 
      image: MEN_IMAGES.trousers, 
      rating: 4.3, 
      reviews: 189,
      category: 'trousers',
      sizes: ['30', '32', '34', '36'],
      colors: ['Olive', 'Black', 'Khaki'],
      description: 'Functional cargo pants with multiple pockets',
      isNew: false,
      isBestseller: false,
      stock: 64
    },
    { 
      _id: 'tr5', 
      name: 'Track Pants Sport', 
      price: 1299, 
      discountedPrice: 999, 
      image: MEN_IMAGES.trousers, 
      rating: 4.5, 
      reviews: 312,
      category: 'trousers',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey'],
      description: 'Comfortable track pants for gym and leisure',
      isNew: false,
      isBestseller: false,
      stock: 91
    },
    { 
      _id: 'tr6', 
      name: 'Linen Trousers Summer', 
      price: 1799, 
      discountedPrice: 1399, 
      image: MEN_IMAGES.trousers, 
      rating: 4.4, 
      reviews: 156,
      category: 'trousers',
      sizes: ['30', '32', '34'],
      colors: ['Beige', 'White', 'Light Grey'],
      description: 'Breathable linen trousers for warm days',
      isNew: false,
      isBestseller: false,
      stock: 58
    },
  ],

  // ── Shoes ───────────────────────────────────────────────────────────────
  shoes: [
    { 
      _id: 'sh1', 
      name: 'White Sneakers Classic', 
      price: 2999, 
      discountedPrice: 2499, 
      image: MEN_IMAGES.shoes, 
      rating: 4.7, 
      reviews: 678,
      category: 'shoes',
      sizes: ['6', '7', '8', '9', '10', '11'],
      colors: ['White', 'White/Black'],
      description: 'Timeless white sneakers with premium leather',
      isNew: false,
      isBestseller: true,
      stock: 134
    },
    { 
      _id: 'sh2', 
      name: 'Formal Oxford Shoes', 
      price: 3499, 
      discountedPrice: 2999, 
      image: MEN_IMAGES.shoes, 
      rating: 4.6, 
      reviews: 289,
      category: 'shoes',
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['Black', 'Brown'],
      description: 'Elegant oxford shoes for formal occasions',
      isNew: false,
      isBestseller: true,
      stock: 67
    },
    { 
      _id: 'sh3', 
      name: 'Running Shoes Pro', 
      price: 3999, 
      discountedPrice: 3499, 
      image: MEN_IMAGES.shoes, 
      rating: 4.8, 
      reviews: 512,
      category: 'shoes',
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['Black/Red', 'Grey/Blue', 'White'],
      description: 'Performance running shoes with cushioned sole',
      isNew: false,
      isBestseller: true,
      stock: 89
    },
    { 
      _id: 'sh4', 
      name: 'Casual Loafers', 
      price: 2499, 
      discountedPrice: 1999, 
      image: MEN_IMAGES.shoes, 
      rating: 4.5, 
      reviews: 234,
      category: 'shoes',
      sizes: ['7', '8', '9', '10'],
      colors: ['Brown', 'Black', 'Tan'],
      description: 'Slip-on loafers for effortless style',
      isNew: false,
      isBestseller: false,
      stock: 72
    },
    { 
      _id: 'sh5', 
      name: 'High-Top Sneakers', 
      price: 3299, 
      discountedPrice: 2799, 
      image: MEN_IMAGES.shoes, 
      rating: 4.6, 
      reviews: 345,
      category: 'shoes',
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['Black', 'White', 'Navy'],
      description: 'Street-style high-tops with ankle support',
      isNew: false,
      isBestseller: false,
      stock: 54
    },
    { 
      _id: 'sh6', 
      name: 'Boat Shoes Nautical', 
      price: 2799, 
      discountedPrice: 2299, 
      image: MEN_IMAGES.shoes, 
      rating: 4.4, 
      reviews: 167,
      category: 'shoes',
      sizes: ['7', '8', '9', '10'],
      colors: ['Brown', 'Navy'],
      description: 'Classic boat shoes with non-slip sole',
      isNew: false,
      isBestseller: false,
      stock: 48
    },
  ]
}

// ============================================================================
// 🧭 SECTION CONFIGURATION WITH METADATA
// ============================================================================
const SECTIONS = [
  { 
    id: 'newArrivals', 
    title: 'New Arrivals', 
    subtitle: 'Fresh drops this week',
    description: 'Be the first to shop our latest collections',
    icon: 'sparkles',
    bgColor: 'from-indigo-50 to-white',
    showViewAll: true
  },
  { 
    id: 'tshirts', 
    title: 'T-Shirts', 
    subtitle: 'Basic, Oversized & Printed',
    description: 'Comfortable tees for every occasion',
    icon: 'shirt',
    bgColor: 'from-slate-50 to-white',
    showViewAll: true
  },
  { 
    id: 'shirts', 
    title: 'Shirts', 
    subtitle: 'Formal & Casual',
    description: 'Look sharp from office to weekend',
    icon: 'collar',
    bgColor: 'from-indigo-50 to-white',
    showViewAll: true
  },
  { 
    id: 'jeans', 
    title: 'Jeans', 
    subtitle: 'Slim, Regular & Baggy',
    description: 'Find your perfect fit',
    icon: 'jeans',
    bgColor: 'from-slate-50 to-white',
    showViewAll: true
  },
  { 
    id: 'jackets', 
    title: 'Jackets & Hoodies', 
    subtitle: 'Stay warm in style',
    description: 'Layer up with premium outerwear',
    icon: 'jacket',
    bgColor: 'from-indigo-50 to-white',
    showViewAll: true
  },
  { 
    id: 'trousers', 
    title: 'Trousers & Joggers', 
    subtitle: 'Comfort meets style',
    description: 'Versatile bottoms for any look',
    icon: 'trouser',
    bgColor: 'from-slate-50 to-white',
    showViewAll: true
  },
  { 
    id: 'shoes', 
    title: 'Shoes', 
    subtitle: 'Sneakers & Formal',
    description: 'Step up your footwear game',
    icon: 'shoe',
    bgColor: 'from-indigo-50 to-white',
    showViewAll: true
  },
]

// ============================================================================
// 🎨 UTILITY FUNCTIONS
// ============================================================================

// Calculate discount percentage
const calculateDiscount = (price, discountedPrice) => {
  if (!price || !discountedPrice || price === discountedPrice) return 0
  return Math.round(((price - discountedPrice) / price) * 100)
}

// Format price with currency
const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

// Generate star rating SVG
const StarRating = ({ rating, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg 
          key={star}
          className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
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
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
})
Badge.displayName = 'Badge'

// ── Button Component ──────────────────────────────────────────────────────
const Button = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 active:scale-95',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-9 py-4 text-lg'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
})
Button.displayName = 'Button'

// ── Product Card Component (Enhanced) ─────────────────────────────────────
const ProductCard = memo(({ product, onAddToCart, onQuickView, onWishlist, isAdding, isInWishlist }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const discount = calculateDiscount(product.price, product.discountedPrice)
  
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])
  
  const handleAddToCart = useCallback((e) => {
    e.stopPropagation()
    onAddToCart?.(product)
  }, [product, onAddToCart])
  
  const handleQuickView = useCallback((e) => {
    e.stopPropagation()
    onQuickView?.(product)
  }, [product, onQuickView])
  
  const handleWishlist = useCallback((e) => {
    e.stopPropagation()
    onWishlist?.(product)
  }, [product, onWishlist])

  return (
    <article 
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`product-${product._id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" aria-hidden="true" />
        )}
        
        {/* Product Image */}
        <img
          src={product.image || MEN_IMAGES.placeholder}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageLoad}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="primary">New</Badge>}
          {product.isBestseller && <Badge variant="warning">Bestseller</Badge>}
          {discount > 0 && (
            <Badge variant="success">-{discount}%</Badge>
          )}
          {product.stock < 20 && product.stock > 0 && (
            <Badge variant="warning">Low Stock</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Quick Actions (visible on hover) */}
        <div className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            loading={isAdding}
            className="flex-1"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          
          <button
            onClick={handleQuickView}
            className="p-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            aria-label={`Quick view ${product.name}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          <button
            onClick={handleWishlist}
            className={`p-2.5 rounded-xl border transition-colors ${
              isInWishlist 
                ? 'bg-red-50 text-red-500 border-red-200' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isInWishlist}
          >
            <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Wishlist Button (always visible on mobile) */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 lg:hidden w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-slate-400'}`} viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Tag */}
        {product.category && (
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            {product.category}
          </p>
        )}
        
        {/* Product Name */}
        <h3 
          id={`product-${product._id}`}
          className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors"
        >
          {product.name}
        </h3>
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} size="xs" />
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-indigo-600">
            {formatPrice(product.discountedPrice)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Available Sizes (Mini Preview) */}
        {product.sizes?.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-2">Sizes:</span>
            {product.sizes.slice(0, 4).map(size => (
              <span key={size} className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-slate-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
})
ProductCard.displayName = 'ProductCard'

// ── Filter Sidebar Component (Enhanced) ───────────────────────────────────
const FilterSidebar = memo(({ filters, setFilters, isOpen, onClose, onApply }) => {
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: 99999 },
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = [
    { name: 'Black', value: 'black', class: 'bg-slate-900' },
    { name: 'White', value: 'white', class: 'bg-white border border-slate-200' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-600' },
    { name: 'Grey', value: 'grey', class: 'bg-slate-500' },
    { name: 'Navy', value: 'navy', class: 'bg-indigo-900' },
    { name: 'Brown', value: 'brown', class: 'bg-amber-700' },
    { name: 'Green', value: 'green', class: 'bg-green-700' },
    { name: 'Red', value: 'red', class: 'bg-red-600' },
  ]

  const handlePriceChange = useCallback((min, max) => {
    setFilters(prev => ({ ...prev, priceRange: [min, max] }))
  }, [setFilters])

  const handleSizeToggle = useCallback((size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }, [setFilters])

  const handleColorToggle = useCallback((color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }, [setFilters])

  const handleClearAll = useCallback(() => {
    setFilters({
      priceRange: [0, 99999],
      sizes: [],
      colors: [],
      sortBy: 'newest',
      inStock: false,
      onSale: false
    })
    onApply?.()
  }, [setFilters, onApply])

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
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-72 
          bg-white lg:bg-transparent border-r lg:border-r-0 border-slate-200
          transform transition-transform duration-300 ease-in-out z-50 lg:z-auto lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto lg:overflow-visible
          flex flex-col
        `}
        aria-label="Product filters"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 lg:hidden">
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 p-4 lg:p-0 space-y-6 lg:space-y-8">
          
          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="lg:hidden p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-700 font-medium">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                </span>
                <button 
                  onClick={handleClearAll}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Price Range */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Price Range
            </h3>
            <div className="space-y-2">
              {priceRanges.map((range, idx) => {
                const isActive = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                return (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      isActive ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={isActive}
                      onChange={() => handlePriceChange(range.min, range.max)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${isActive ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>
                      {range.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Sizes */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => {
                const isSelected = filters.sizes.includes(size)
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Colors */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Color
            </h3>
            <div className="space-y-2">
              {colors.map(color => {
                const isSelected = filters.colors.includes(color.value)
                return (
                  <label 
                    key={color.value}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleColorToggle(color.value)}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${color.class} ${isSelected ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}`} />
                    <span className={`text-sm ${isSelected ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>
                      {color.name}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Additional Filters */}
          <section className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">In Stock Only</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">On Sale</span>
            </label>
          </section>

          {/* Clear Filters Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            fullWidth 
            onClick={handleClearAll}
            className="lg:hidden"
          >
            Clear All Filters
          </Button>
        </div>

        {/* Mobile Apply Button */}
        <div className="p-4 border-t border-slate-200 lg:hidden">
          <Button variant="primary" fullWidth onClick={() => { onApply?.(); onClose() }}>
            Apply Filters ({activeFiltersCount})
          </Button>
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
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
        {section.title}
      </h2>
      <p className="text-slate-500 text-sm sm:text-base">
        {section.subtitle}
      </p>
      {section.description && (
        <p className="text-slate-400 text-sm mt-1 hidden sm:block">
          {section.description}
        </p>
      )}
    </div>
    {section.showViewAll && onViewAll && (
      <Link 
        to={`/shop/${section.id}`}
        onClick={onViewAll}
        className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition-colors group"
      >
        View All
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    )}
  </div>
))
SectionHeader.displayName = 'SectionHeader'

// ── Loading Skeleton Component ────────────────────────────────────────────
const ProductSkeleton = memo(() => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
    <div className="aspect-[3/4] bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-200 rounded w-1/4" />
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 bg-slate-200 rounded w-16" />
        <div className="h-6 bg-slate-200 rounded w-12" />
      </div>
    </div>
  </div>
))
ProductSkeleton.displayName = 'ProductSkeleton'

// ── Empty State Component ─────────────────────────────────────────────────
const EmptyState = memo(({ title, description, actionLabel, onAction }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 mx-auto">
      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
))
EmptyState.displayName = 'EmptyState'

// ============================================================================
// 🎯 MAIN MEN PAGE COMPONENT
// ============================================================================
export default function Men() {
  // ── State Management ────────────────────────────────────────────────────
  const { addToCart } = useCart()
  const navigate = useNavigate()
  
  const [products] = useState(SAMPLE_PRODUCTS)
  const [filters, setFilters] = useState({
    priceRange: [0, 99999],
    sizes: [],
    colors: [],
    sortBy: 'newest',
    inStock: false,
    onSale: false
  })
  const [addingId, setAddingId] = useState(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [viewedProducts, setViewedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('viewedProducts')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ── Refs ────────────────────────────────────────────────────────────────
  const sectionRefs = useRef({})
  const toastShown = useRef({})

  // ── Persist wishlist to localStorage ────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    } catch (err) {
      console.error('Failed to save wishlist:', err)
    }
  }, [wishlist])

  // ── Persist viewed products ─────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts.slice(-20)))
    } catch (err) {
      console.error('Failed to save viewed products:', err)
    }
  }, [viewedProducts])

  // ── Add to Cart Handler with Animation & Toast ──────────────────────────
  const handleAddToCart = useCallback(async (product) => {
    if (addingId === product._id) return
    
    try {
      setAddingId(product._id)
      
      // Track viewed product
      if (!viewedProducts.includes(product._id)) {
        setViewedProducts(prev => [...prev, product._id])
      }
      
      // Add to cart
      await addToCart({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString()
      })
      
      // Show success toast (only once per session per product)
      const toastKey = `added-${product._id}`
      if (!toastShown.current[toastKey]) {
        toast.success(
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Added "{product.name}" to cart</span>
          </div>,
          {
            duration: 3000,
            position: 'bottom-right',
            id: toastKey
          }
        )
        toastShown.current[toastKey] = true
      }
      
    } catch (err) {
      toast.error('Failed to add to cart. Please try again.')
      console.error('Add to cart error:', err)
    } finally {
      // Reset adding state after animation
      setTimeout(() => setAddingId(null), 500)
    }
  }, [addToCart, addingId, viewedProducts])

  // ── Wishlist Toggle Handler ─────────────────────────────────────────────
  const handleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.includes(product._id)
      const updated = exists 
        ? prev.filter(id => id !== product._id)
        : [...prev, product._id]
      
      // Show feedback toast
      toast(
        exists ? 'Removed from wishlist' : 'Added to wishlist',
        {
          duration: 2000,
          position: 'bottom-right',
          icon: exists ? '❤️' : '💙'
        }
      )
      
      return updated
    })
  }, [])

  // ── Quick View Handler ──────────────────────────────────────────────────
  const handleQuickView = useCallback((product) => {
    // Track as viewed
    if (!viewedProducts.includes(product._id)) {
      setViewedProducts(prev => [...prev, product._id])
    }
    // Navigate to product detail
    navigate(`/product/${product._id}`, { state: { from: '/men' } })
  }, [navigate, viewedProducts])

  // ── Filter Products Logic ───────────────────────────────────────────────
  const filterProducts = useCallback((categoryProducts) => {
    return categoryProducts.filter(product => {
      // Price filter
      const priceMatch = product.discountedPrice >= filters.priceRange[0] && 
                         product.discountedPrice <= filters.priceRange[1]
      
      // Size filter (check if any selected size is available)
      const sizeMatch = filters.sizes.length === 0 || 
                        filters.sizes.some(size => product.sizes?.includes(size))
      
      // Color filter (simple text match for demo)
      const colorMatch = filters.colors.length === 0 || 
                         filters.colors.some(color => 
                           product.colors?.some(c => c.toLowerCase().includes(color.toLowerCase())) ||
                           product.name.toLowerCase().includes(color.toLowerCase())
                         )
      
      // Stock filter
      const stockMatch = !filters.inStock || product.stock > 0
      
      // Sale filter
      const saleMatch = !filters.onSale || product.discountedPrice < product.price
      
      return priceMatch && sizeMatch && colorMatch && stockMatch && saleMatch
    })
  }, [filters])

  // ── Sort Products Logic ─────────────────────────────────────────────────
  const sortProducts = useCallback((categoryProducts) => {
    const sorted = [...categoryProducts]
    switch (filters.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.discountedPrice - b.discountedPrice)
      case 'price-high':
        return sorted.sort((a, b) => b.discountedPrice - a.discountedPrice)
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'reviews':
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      default:
        return sorted.sort((a, b) => {
          // Prioritize new arrivals and bestsellers
          if (a.isNew && !b.isNew) return -1
          if (!a.isNew && b.isNew) return 1
          if (a.isBestseller && !b.isBestseller) return -1
          if (!a.isBestseller && b.isBestseller) return 1
          return 0
        })
    }
  }, [filters.sortBy])

  // ── Scroll to Section Handler ───────────────────────────────────────────
  const scrollToSection = useCallback((sectionId) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // ── Memoized Processed Products ─────────────────────────────────────────
  const processedProducts = useMemo(() => {
    const result = {}
    Object.entries(products).forEach(([key, items]) => {
      result[key] = sortProducts(filterProducts(items))
    })
    return result
  }, [products, filters, filterProducts, sortProducts])

  // ── Breadcrumb Component ────────────────────────────────────────────────
  const Breadcrumb = () => (
    <nav className="flex mb-4 sm:mb-6 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 sm:gap-2 text-slate-500">
        <li>
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        </li>
        <li>
          <svg className="w-4 h-4 mx-1 sm:mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li>
          <Link to="/men" className="hover:text-indigo-600 transition-colors">Men</Link>
        </li>
      </ol>
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Section with Parallax Effect ───────────────────────────── */}
      <section 
        className="relative h-[60vh] sm:h-[70vh] min-h-[500px] bg-slate-900 flex items-center justify-center overflow-hidden"
        aria-label="Men's collection hero"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 768px)" srcSet={MEN_IMAGES.heroMobile} />
            <img 
              src={MEN_IMAGES.hero} 
              alt="Men's fashion collection" 
              className="w-full h-full object-cover opacity-40"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Badge variant="primary" className="mb-4 animate-fade-in">New Collection</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight leading-tight">
            Men's Collection
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Premium fashion for the modern man. Discover quality essentials and statement pieces crafted for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="#shop" 
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Shop Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <Button variant="secondary" size="lg" onClick={() => scrollToSection('newArrivals')}>
              Explore Categories
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a 
          href="#shop" 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 hover:text-white transition-colors"
          aria-label="Scroll to products"
        >
          <span className="text-xs mb-2">Scroll</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* ── Main Content Area ───────────────────────────────────────────── */}
      <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Toolbar: Filters Toggle + Sort */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-sm"
            aria-label="Open filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filters</span>
            {(filters.sizes.length > 0 || filters.colors.length > 0 || filters.inStock || filters.onSale) && (
              <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                {filters.sizes.length + filters.colors.length + (filters.inStock ? 1 : 0) + (filters.onSale ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 ml-auto">
            <label htmlFor="sort-select" className="text-sm text-slate-600 hidden sm:block">Sort by:</label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              aria-label="Sort products"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters}
                isOpen={mobileFilterOpen}
                onClose={() => setMobileFilterOpen(false)}
                onApply={() => {}}
              />
            </div>
          </div>

          {/* Product Sections */}
          <div className="lg:col-span-3 space-y-12 lg:space-y-16">
            {SECTIONS.map(section => {
              const sectionProducts = processedProducts[section.id] || []
              const hasProducts = sectionProducts.length > 0
              
              return (
                <section 
                  key={section.id} 
                  id={section.id}
                  ref={el => sectionRefs.current[section.id] = el}
                  className={`scroll-mt-24 ${section.bgColor ? `bg-gradient-to-b ${section.bgColor}` : ''} rounded-3xl p-6 sm:p-8`}
                  aria-labelledby={`${section.id}-heading`}
                >
                  <SectionHeader 
                    section={section} 
                    onViewAll={() => navigate(`/shop/${section.id}`)} 
                  />

                  {hasProducts ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {sectionProducts.map(product => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onAddToCart={handleAddToCart}
                          onQuickView={handleQuickView}
                          onWishlist={handleWishlist}
                          isAdding={addingId === product._id}
                          isInWishlist={wishlist.includes(product._id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No products found"
                      description="Try adjusting your filters or check back later for new arrivals."
                      actionLabel="Clear Filters"
                      onAction={() => setFilters({
                        priceRange: [0, 99999],
                        sizes: [],
                        colors: [],
                        sortBy: 'newest',
                        inStock: false,
                        onSale: false
                      })}
                    />
                  )}

                  {/* Section Load More (if needed) */}
                  {hasProducts && sectionProducts.length >= 4 && section.showViewAll && (
                    <div className="mt-8 text-center">
                      <Button variant="outline" size="md" onClick={() => navigate(`/shop/${section.id}`)}>
                        View All {section.title}
                      </Button>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </div>

        {/* Recently Viewed Section */}
        {viewedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {viewedProducts.slice(-6).reverse().map(productId => {
                // Find product in all categories
                let product = null
                for (const category of Object.values(SAMPLE_PRODUCTS)) {
                  const found = category.find(p => p._id === productId)
                  if (found) {
                    product = found
                    break
                  }
                }
                if (!product) return null
                
                return (
                  <button
                    key={productId}
                    onClick={() => navigate(`/product/${productId}`)}
                    className="text-left group"
                  >
                    <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
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

      {/* ── Trust Badges Section ────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
                title: 'Free Shipping',
                description: 'On orders over ₹999'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: 'Easy Returns',
                description: '10-day return policy'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Secure Payment',
                description: '100% secure checkout'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: '24/7 Support',
                description: 'Dedicated customer care'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA Section ──────────────────────────────────────── */}
      <section className="bg-slate-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Subscribe to get exclusive offers, early access to sales, and style inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <Button variant="primary" size="lg" type="submit">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-slate-500 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </section>
    </div>
  )
}