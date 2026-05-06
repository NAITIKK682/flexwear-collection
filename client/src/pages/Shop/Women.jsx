import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

// ============================================================================
// 🎨 THEME CONSTANTS - Rose/Pink palette for Women's collection
// ============================================================================
const THEME = {
  colors: {
    primary: 'rose-500',
    primaryHover: 'rose-600',
    primaryLight: 'rose-50',
    primaryLighter: 'rose-100',
    secondary: 'slate-600',
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
    }
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out'
  }
}

// ============================================================================
// 🖼️ IMAGE PATHS - Matching folder structure
// ============================================================================
const WOMEN_IMAGES = {
  hero: '/images/women/hero-banner.jpg',
  heroMobile: '/images/women/hero-banner-mobile.jpg',
  dresses: '/images/women/dresses/dress1.jpg',
  tops: '/images/women/tops/top1.jpg',
  jeans: '/images/women/jeans/jeans1.jpg',
  ethnic: '/images/women/ethnic/kurti1.jpg',
  footwear: '/images/women/footwear/shoe1.jpg',
  accessories: '/images/women/accessories/bag1.jpg',
  trending: '/images/women/trending/trend1.jpg',
  placeholder: '/images/placeholder-product.jpg'
}

// ============================================================================
// 📦 COMPREHENSIVE PRODUCTS DATA - 42+ products across 7 categories
// ============================================================================
const SAMPLE_PRODUCTS = {
  // ── 1. Dresses (Casual, Party, Maxi) ───────────────────────────────────
  dresses: [
    { _id: 'wd1', name: 'Floral Summer Maxi Dress', price: 2499, discountedPrice: 1999, image: '/images/women/dresses/maxi-floral-1.jpg', rating: 4.7, reviews: 342, category: 'dresses', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Floral Blue', 'Floral Pink', 'Floral Yellow'], description: 'Flowy maxi dress perfect for summer', isNew: true, isBestseller: true, stock: 45, type: 'Maxi' },
    { _id: 'wd2', name: 'Elegant Party Dress Black', price: 3999, discountedPrice: 3299, image: '/images/women/dresses/party-black-1.jpg', rating: 4.9, reviews: 189, category: 'dresses', sizes: ['S', 'M', 'L'], colors: ['Black', 'Navy', 'Burgundy'], description: 'Stunning dress for special occasions', isNew: false, isBestseller: true, stock: 23, type: 'Party' },
    { _id: 'wd3', name: 'Casual Cotton Day Dress', price: 1299, discountedPrice: 999, image: '/images/women/dresses/casual-cotton-1.jpg', rating: 4.5, reviews: 456, category: 'dresses', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Beige', 'Light Blue', 'Pink'], description: 'Comfortable everyday casual dress', isNew: false, isBestseller: true, stock: 78, type: 'Casual' },
    { _id: 'wd4', name: 'Wrap Dress Classic Red', price: 2199, discountedPrice: 1799, image: '/images/women/dresses/wrap-red-1.jpg', rating: 4.6, reviews: 267, category: 'dresses', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Red', 'Emerald'], description: 'Flattering wrap silhouette', isNew: false, isBestseller: false, stock: 56, type: 'Casual' },
    { _id: 'wd5', name: 'Mini Dress Trendy Party', price: 1799, discountedPrice: 1499, image: '/images/women/dresses/mini-party-1.jpg', rating: 4.4, reviews: 198, category: 'dresses', sizes: ['XS', 'S', 'M'], colors: ['Black', 'White', 'Pink'], description: 'Chic mini dress for night outs', isNew: true, isBestseller: false, stock: 34, type: 'Party' },
    { _id: 'wd6', name: 'Midi Dress Office Professional', price: 2299, discountedPrice: 1899, image: '/images/women/dresses/midi-office-1.jpg', rating: 4.7, reviews: 312, category: 'dresses', sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy', 'Grey', 'Black'], description: 'Professional midi dress for work', isNew: false, isBestseller: true, stock: 67, type: 'Casual' },
  ],

  // ── 2. Tops & Blouses ──────────────────────────────────────────────────
  tops: [
    { _id: 'wt1', name: 'Silk Blouse Elegant White', price: 1899, discountedPrice: 1499, image: '/images/women/tops/silk-blouse-1.jpg', rating: 4.6, reviews: 289, category: 'tops', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White', 'Blush', 'Ivory', 'Black'], description: 'Luxurious silk blouse for formal', isNew: false, isBestseller: true, stock: 52, type: 'Blouse' },
    { _id: 'wt2', name: 'Casual Cotton Top Basic', price: 799, discountedPrice: 599, image: '/images/women/tops/cotton-top-1.jpg', rating: 4.5, reviews: 523, category: 'tops', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Black', 'Grey', 'Pink', 'Blue'], description: 'Everyday comfortable cotton top', isNew: false, isBestseller: true, stock: 134, type: 'Top' },
    { _id: 'wt3', name: 'Off-Shoulder Top Trendy', price: 1299, discountedPrice: 999, image: '/images/women/tops/off-shoulder-1.jpg', rating: 4.7, reviews: 234, category: 'tops', sizes: ['XS', 'S', 'M', 'L'], colors: ['White', 'Black', 'Red'], description: 'Trendy off-shoulder for parties', isNew: true, isBestseller: false, stock: 41, type: 'Top' },
    { _id: 'wt4', name: 'Peplum Top Flared Black', price: 1499, discountedPrice: 1199, image: '/images/women/tops/peplum-1.jpg', rating: 4.4, reviews: 178, category: 'tops', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy', 'Burgundy'], description: 'Flattering peplum cut', isNew: false, isBestseller: false, stock: 63, type: 'Top' },
    { _id: 'wt5', name: 'Tunic Top Long Beige', price: 1199, discountedPrice: 899, image: '/images/women/tops/tunic-1.jpg', rating: 4.5, reviews: 312, category: 'tops', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Beige', 'Olive'], description: 'Versatile long tunic', isNew: false, isBestseller: true, stock: 87, type: 'Top' },
    { _id: 'wt6', name: 'Crop Top Trendy Youth', price: 899, discountedPrice: 699, image: '/images/women/tops/crop-top-1.jpg', rating: 4.3, reviews: 267, category: 'tops', sizes: ['XS', 'S', 'M'], colors: ['Black', 'White', 'Pink', 'Blue'], description: 'Youthful crop top', isNew: true, isBestseller: false, stock: 94, type: 'Top' },
  ],

  // ── 3. Jeans & Pants ───────────────────────────────────────────────────
  jeans: [
    { _id: 'wj1', name: 'High-Waist Skinny Jeans', price: 2199, discountedPrice: 1799, image: '/images/women/jeans/skinny-highwaist-1.jpg', rating: 4.7, reviews: 456, category: 'jeans', sizes: ['24', '26', '28', '30', '32'], colors: ['Dark Blue', 'Black', 'Light Blue'], description: 'Flattering high-waist skinny', isNew: false, isBestseller: true, stock: 89, type: 'Jeans' },
    { _id: 'wj2', name: 'Wide Leg Trousers Elegant', price: 1899, discountedPrice: 1499, image: '/images/women/jeans/wide-leg-1.jpg', rating: 4.5, reviews: 234, category: 'jeans', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'Beige', 'Navy', 'Grey'], description: 'Elegant wide leg trousers', isNew: false, isBestseller: true, stock: 67, type: 'Pants' },
    { _id: 'wj3', name: 'Mom Jeans Vintage Blue', price: 1999, discountedPrice: 1599, image: '/images/women/jeans/mom-jeans-1.jpg', rating: 4.6, reviews: 312, category: 'jeans', sizes: ['24', '26', '28', '30'], colors: ['Light Blue', 'Medium Blue'], description: 'Retro mom jeans relaxed fit', isNew: false, isBestseller: false, stock: 54, type: 'Jeans' },
    { _id: 'wj4', name: 'Palazzo Pants Flowy', price: 1599, discountedPrice: 1299, image: '/images/women/jeans/palazzo-1.jpg', rating: 4.4, reviews: 189, category: 'jeans', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Navy', 'Maroon'], description: 'Comfortable flowy palazzo', isNew: false, isBestseller: false, stock: 72, type: 'Pants' },
    { _id: 'wj5', name: 'Straight Leg Classic Denim', price: 2099, discountedPrice: 1699, image: '/images/women/jeans/straight-leg-1.jpg', rating: 4.7, reviews: 378, category: 'jeans', sizes: ['26', '28', '30', '32'], colors: ['Dark Blue', 'Black'], description: 'Timeless straight leg', isNew: false, isBestseller: true, stock: 61, type: 'Jeans' },
    { _id: 'wj6', name: 'Jogger Pants Casual Comfort', price: 1399, discountedPrice: 1099, image: '/images/women/jeans/joggers-1.jpg', rating: 4.5, reviews: 267, category: 'jeans', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'Grey', 'Navy'], description: 'Comfortable joggers', isNew: true, isBestseller: false, stock: 98, type: 'Pants' },
  ],

  // ── 4. Ethnic Wear (Kurtis / Sarees) ──────────────────────────────────
  ethnic: [
    { _id: 'we1', name: 'Cotton Kurti Floral Print', price: 1299, discountedPrice: 999, image: '/images/women/ethnic/kurti-floral-1.jpg', rating: 4.6, reviews: 412, category: 'ethnic', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Pink Floral', 'Blue Floral', 'Yellow Floral'], description: 'Comfortable cotton kurti', isNew: false, isBestseller: true, stock: 112, type: 'Kurti' },
    { _id: 'we2', name: 'Anarkali Suit Party Wear', price: 3499, discountedPrice: 2799, image: '/images/women/ethnic/anarkali-1.jpg', rating: 4.8, reviews: 189, category: 'ethnic', sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Navy', 'Emerald'], description: 'Elegant anarkali for festive', isNew: false, isBestseller: true, stock: 34, type: 'Suit' },
    { _id: 'we3', name: 'Straight Cut Kurti Simple', price: 999, discountedPrice: 799, image: '/images/women/ethnic/kurti-straight-1.jpg', rating: 4.4, reviews: 356, category: 'ethnic', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White', 'Black', 'Beige', 'Pink'], description: 'Simple straight cut kurti', isNew: false, isBestseller: true, stock: 145, type: 'Kurti' },
    { _id: 'we4', name: 'Saree Silk Blend Traditional', price: 4999, discountedPrice: 3999, image: '/images/women/ethnic/saree-silk-1.jpg', rating: 4.9, reviews: 123, category: 'ethnic', sizes: ['Free Size'], colors: ['Red', 'Blue', 'Green', 'Purple'], description: 'Luxurious silk blend saree', isNew: true, isBestseller: false, stock: 28, type: 'Saree' },
    { _id: 'we5', name: 'Palazzo Suit Set Coordinated', price: 2299, discountedPrice: 1799, image: '/images/women/ethnic/palazzo-suit-1.jpg', rating: 4.5, reviews: 234, category: 'ethnic', sizes: ['S', 'M', 'L', 'XL'], colors: ['Pink', 'Blue', 'Grey'], description: 'Kurti with palazzo pants', isNew: false, isBestseller: false, stock: 67, type: 'Suit' },
    { _id: 'we6', name: 'Embroidered Kurti Premium', price: 1799, discountedPrice: 1399, image: '/images/women/ethnic/kurti-embroidered-1.jpg', rating: 4.7, reviews: 298, category: 'ethnic', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Black', 'Maroon'], description: 'Beautiful embroidery work', isNew: false, isBestseller: true, stock: 53, type: 'Kurti' },
  ],

  // ── 5. Footwear (Heels, Flats, Sneakers) ──────────────────────────────
  footwear: [
    { _id: 'wf1', name: 'Block Heel Sandals Comfort', price: 2499, discountedPrice: 1999, image: '/images/women/footwear/block-heel-1.jpg', rating: 4.6, reviews: 312, category: 'footwear', sizes: ['5', '6', '7', '8', '9'], colors: ['Black', 'Beige', 'Red'], description: 'Comfortable block heels', isNew: false, isBestseller: true, stock: 78, type: 'Heels' },
    { _id: 'wf2', name: 'Ballet Flats Classic Nude', price: 1299, discountedPrice: 999, image: '/images/women/footwear/ballet-flats-1.jpg', rating: 4.5, reviews: 456, category: 'footwear', sizes: ['5', '6', '7', '8', '9', '10'], colors: ['Black', 'Nude', 'Red', 'Silver'], description: 'Timeless ballet flats', isNew: false, isBestseller: true, stock: 124, type: 'Flats' },
    { _id: 'wf3', name: 'White Sneakers Women Trendy', price: 2799, discountedPrice: 2299, image: '/images/women/footwear/sneakers-white-1.jpg', rating: 4.7, reviews: 523, category: 'footwear', sizes: ['5', '6', '7', '8', '9'], colors: ['White', 'White/Pink', 'White/Gold'], description: 'Trendy white sneakers', isNew: false, isBestseller: true, stock: 91, type: 'Sneakers' },
    { _id: 'wf4', name: 'Strappy Heels Party Gold', price: 3299, discountedPrice: 2699, image: '/images/women/footwear/strappy-heels-1.jpg', rating: 4.8, reviews: 189, category: 'footwear', sizes: ['5', '6', '7', '8'], colors: ['Black', 'Gold', 'Silver'], description: 'Glamorous strappy heels', isNew: true, isBestseller: false, stock: 42, type: 'Heels' },
    { _id: 'wf5', name: 'Loafers Comfort Slip-On', price: 1899, discountedPrice: 1499, image: '/images/women/footwear/loafers-1.jpg', rating: 4.4, reviews: 267, category: 'footwear', sizes: ['5', '6', '7', '8', '9'], colors: ['Black', 'Brown', 'Tan'], description: 'Slip-on loafers effortless', isNew: false, isBestseller: false, stock: 68, type: 'Flats' },
    { _id: 'wf6', name: 'Running Shoes Sport Pink', price: 3499, discountedPrice: 2999, image: '/images/women/footwear/running-shoes-1.jpg', rating: 4.7, reviews: 378, category: 'footwear', sizes: ['5', '6', '7', '8', '9'], colors: ['Pink', 'Purple', 'Black/Pink'], description: 'Performance running shoes', isNew: false, isBestseller: true, stock: 56, type: 'Sneakers' },
  ],

  // ── 6. Accessories (Bags, Jewelry) ────────────────────────────────────
  accessories: [
    { _id: 'wa1', name: 'Leather Handbag Classic Black', price: 3499, discountedPrice: 2799, image: '/images/women/accessories/handbag-leather-1.jpg', rating: 4.7, reviews: 289, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Brown', 'Beige', 'Red'], description: 'Premium leather handbag', isNew: false, isBestseller: true, stock: 45, type: 'Bag' },
    { _id: 'wa2', name: 'Statement Necklace Gold Bold', price: 1299, discountedPrice: 999, image: '/images/women/accessories/necklace-statement-1.jpg', rating: 4.5, reviews: 234, category: 'accessories', sizes: ['One Size'], colors: ['Gold', 'Silver', 'Rose Gold'], description: 'Bold statement necklace', isNew: false, isBestseller: false, stock: 78, type: 'Jewelry' },
    { _id: 'wa3', name: 'Crossbody Bag Mini Compact', price: 1899, discountedPrice: 1499, image: '/images/women/accessories/crossbody-mini-1.jpg', rating: 4.6, reviews: 312, category: 'accessories', sizes: ['One Size'], colors: ['Black', 'Pink', 'White', 'Tan'], description: 'Compact crossbody bag', isNew: true, isBestseller: true, stock: 63, type: 'Bag' },
    { _id: 'wa4', name: 'Hoop Earrings Silver Classic', price: 799, discountedPrice: 599, image: '/images/women/accessories/hoop-earrings-1.jpg', rating: 4.4, reviews: 456, category: 'accessories', sizes: ['Small', 'Medium', 'Large'], colors: ['Silver', 'Gold', 'Rose Gold'], description: 'Classic hoop earrings', isNew: false, isBestseller: true, stock: 134, type: 'Jewelry' },
    { _id: 'wa5', name: 'Tote Bag Canvas Spacious', price: 1499, discountedPrice: 1199, image: '/images/women/accessories/tote-canvas-1.jpg', rating: 4.5, reviews: 198, category: 'accessories', sizes: ['One Size'], colors: ['Beige', 'Black', 'Navy', 'Olive'], description: 'Spacious canvas tote', isNew: false, isBestseller: false, stock: 87, type: 'Bag' },
    { _id: 'wa6', name: 'Layered Chain Necklace Trendy', price: 999, discountedPrice: 799, image: '/images/women/accessories/layered-chain-1.jpg', rating: 4.6, reviews: 267, category: 'accessories', sizes: ['One Size'], colors: ['Gold', 'Silver'], description: 'Trendy layered chains', isNew: true, isBestseller: false, stock: 92, type: 'Jewelry' },
  ],

  // ── 7. Trending / Best Sellers ────────────────────────────────────────
  trending: [
    { _id: 'wtrend1', name: 'Oversized Blazer Women Power', price: 3299, discountedPrice: 2699, image: '/images/women/trending/blazer-oversized-1.jpg', rating: 4.8, reviews: 412, category: 'trending', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'Beige', 'Grey'], description: 'Power blazer professional', isNew: true, isBestseller: true, stock: 56, type: 'Outerwear' },
    { _id: 'wtrend2', name: 'Ribbed Knit Dress Cozy', price: 1999, discountedPrice: 1599, image: '/images/women/trending/ribbed-dress-1.jpg', rating: 4.7, reviews: 356, category: 'trending', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Camel', 'Olive'], description: 'Cozy ribbed knit dress', isNew: true, isBestseller: true, stock: 43, type: 'Dress' },
    { _id: 'wtrend3', name: 'Wide Belt Leather Statement', price: 1299, discountedPrice: 999, image: '/images/women/trending/wide-belt-1.jpg', rating: 4.5, reviews: 234, category: 'trending', sizes: ['S', 'M', 'L'], colors: ['Black', 'Brown', 'Tan'], description: 'Statement wide belt', isNew: false, isBestseller: true, stock: 78, type: 'Accessory' },
    { _id: 'wtrend4', name: 'Satin Slip Dress Luxury', price: 2499, discountedPrice: 1999, image: '/images/women/trending/satin-slip-1.jpg', rating: 4.9, reviews: 189, category: 'trending', sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Champagne', 'Emerald'], description: 'Luxurious satin slip', isNew: true, isBestseller: true, stock: 34, type: 'Dress' },
    { _id: 'wtrend5', name: 'Platform Sandals Trendy Height', price: 2799, discountedPrice: 2299, image: '/images/women/trending/platform-sandals-1.jpg', rating: 4.6, reviews: 298, category: 'trending', sizes: ['5', '6', '7', '8', '9'], colors: ['Black', 'Beige', 'White'], description: 'Trendy platform sandals', isNew: true, isBestseller: false, stock: 51, type: 'Footwear' },
    { _id: 'wtrend6', name: 'Oversized Sunglasses Chic', price: 1499, discountedPrice: 1199, image: '/images/women/trending/sunglasses-1.jpg', rating: 4.4, reviews: 267, category: 'trending', sizes: ['One Size'], colors: ['Black', 'Tortoise', 'Pink'], description: 'Chic oversized sunglasses', isNew: false, isBestseller: true, stock: 89, type: 'Accessory' },
  ]
}

// ============================================================================
// 🧭 SECTION CONFIGURATION - Women's 7 Categories
// ============================================================================
const SECTIONS = [
  { id: 'trending', title: 'Trending Now', subtitle: 'Best Sellers & Hot Picks', description: 'Discover what everyone is loving right now', bgColor: 'from-rose-50 to-white', showViewAll: true },
  { id: 'dresses', title: 'Dresses', subtitle: 'Casual, Party & Maxi', description: 'Find your perfect dress for every occasion', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'tops', title: 'Tops & Blouses', subtitle: 'Everyday essentials to statement pieces', description: 'Versatile tops for work, weekend, and beyond', bgColor: 'from-rose-50 to-white', showViewAll: true },
  { id: 'jeans', title: 'Jeans & Pants', subtitle: 'Denim, trousers & more', description: 'Comfortable bottoms that fit your lifestyle', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'ethnic', title: 'Ethnic Wear', subtitle: 'Kurtis, Sarees & Traditional', description: 'Celebrate culture with our ethnic collection', bgColor: 'from-rose-50 to-white', showViewAll: true },
  { id: 'footwear', title: 'Footwear', subtitle: 'Heels, Flats & Sneakers', description: 'Step out in style with our shoe collection', bgColor: 'from-slate-50 to-white', showViewAll: true },
  { id: 'accessories', title: 'Accessories', subtitle: 'Bags, Jewelry & More', description: 'Complete your look with the perfect accessories', bgColor: 'from-rose-50 to-white', showViewAll: true },
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
        <svg key={star} className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ============================================================================
// 🧩 REUSABLE UI COMPONENTS
// ============================================================================

const Badge = memo(({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-rose-500 text-white',
    secondary: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700'
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>
})
Badge.displayName = 'Badge'

const Button = memo(({ children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled = false, onClick, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50'
  const variants = {
    primary: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 active:scale-95',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500',
    ghost: 'text-rose-500 hover:bg-rose-50 focus:ring-rose-500',
    outline: 'border-2 border-rose-500 text-rose-500 hover:bg-rose-50'
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5', lg: 'px-7 py-3 text-base', xl: 'px-9 py-4 text-lg' }
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
      {children}
    </button>
  )
})
Button.displayName = 'Button'

const ProductCard = memo(({ product, onAddToCart, onQuickView, onWishlist, isAdding, isInWishlist }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const discount = calculateDiscount(product.price, product.discountedPrice)

  const handleAddToCart = useCallback((e) => { e.stopPropagation(); onAddToCart?.(product) }, [product, onAddToCart])
  const handleQuickView = useCallback((e) => { e.stopPropagation(); onQuickView?.(product) }, [product, onQuickView])
  const handleWishlist = useCallback((e) => { e.stopPropagation(); onWishlist?.(product) }, [product, onWishlist])

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} role="article">
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}
        <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} loading="lazy" onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)} />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="primary">New</Badge>}
          {product.isBestseller && <Badge variant="warning">Bestseller</Badge>}
          {discount > 0 && <Badge variant="success">-{discount}%</Badge>}
        </div>
        <div className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button variant="primary" size="sm" fullWidth onClick={handleAddToCart} disabled={isAdding || product.stock === 0} loading={isAdding} className="flex-1">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <button onClick={handleQuickView} className="p-2.5 bg-white rounded-xl border border-slate-200 hover:bg-slate-50" aria-label="Quick view">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
          <button onClick={handleWishlist} className={`p-2.5 rounded-xl border transition-colors ${isInWishlist ? 'bg-red-50 text-red-500' : 'bg-white hover:bg-red-50 hover:text-red-500'}`} aria-label="Wishlist">
            <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        {product.type && <p className="text-xs text-slate-400 uppercase mb-1">{product.type}</p>}
        <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-rose-500 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3"><StarRating rating={product.rating} size="xs" /><span className="text-xs text-slate-400">({product.reviews})</span></div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-rose-500">{formatPrice(product.discountedPrice)}</span>
          {discount > 0 && <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>}
        </div>
      </div>
    </article>
  )
})
ProductCard.displayName = 'ProductCard'

const FilterSidebar = memo(({ filters, setFilters, isOpen, onClose }) => {
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: 99999 },
  ]
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Pink', 'Blue', 'Beige', 'Red', 'Green', 'Gold']

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 z-50 lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto p-6`}>
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="space-y-6">
          <section>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range, idx) => (
                <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${filters.priceRange[0] === range.min && filters.priceRange[1] === range.max ? 'bg-rose-50' : 'hover:bg-slate-50'}`}>
                  <input type="radio" name="price" checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max} onChange={() => setFilters({ ...filters, priceRange: [range.min, range.max] })} className="w-4 h-4 text-rose-500" />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button key={size} onClick={() => setFilters({ ...filters, sizes: filters.sizes.includes(size) ? filters.sizes.filter(s => s !== size) : [...filters.sizes, size] })} className={`px-3 py-1.5 text-sm rounded-lg border ${filters.sizes.includes(size) ? 'bg-rose-500 text-white border-rose-500' : 'border-slate-200 hover:border-rose-500'}`}>{size}</button>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="space-y-2">
              {colors.map(color => (
                <label key={color} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" checked={filters.colors.includes(color)} onChange={() => setFilters({ ...filters, colors: filters.colors.includes(color) ? filters.colors.filter(c => c !== color) : [...filters.colors, color] })} className="w-4 h-4 text-rose-500 rounded" />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </section>
          <Button variant="ghost" fullWidth onClick={() => setFilters({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest' })}>Clear All Filters</Button>
        </div>
      </aside>
    </>
  )
})
FilterSidebar.displayName = 'FilterSidebar'

// ============================================================================
// 🎯 MAIN WOMEN PAGE COMPONENT
// ============================================================================
export default function Women() {
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
    navigate(`/product/${product._id}`, { state: { from: '/women' } })
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
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[500px] bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-50" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-white/90 text-rose-600">New Collection 2024</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">Women's Collection</h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Discover elegance, comfort, and style. Shop the latest trends in women's fashion.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#shop" className="inline-flex items-center justify-center px-8 py-4 bg-white text-rose-600 font-semibold rounded-full hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Shop Now</a>
            <Button variant="secondary" size="lg" onClick={() => sectionRefs.current['trending']?.scrollIntoView({ behavior: 'smooth' })}>Explore Categories</Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="hover:text-rose-500">Home</Link></li>
            <li><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></li>
            <li className="font-medium text-slate-900">Women</li>
          </ol>
        </nav>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-rose-500 hover:text-rose-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            <span className="font-medium">Filters</span>
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <label className="text-sm text-slate-600 hidden sm:block">Sort by:</label>
            <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1"><div className="lg:sticky lg:top-24"><FilterSidebar filters={filters} setFilters={setFilters} isOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} /></div></div>
          <div className="lg:col-span-3 space-y-12 lg:space-y-16">
            {SECTIONS.map(section => {
              const sectionProducts = processedProducts[section.id] || []
              return (
                <section key={section.id} id={section.id} ref={el => sectionRefs.current[section.id] = el} className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-b ${section.bgColor}`}>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{section.title}</h2>
                      <p className="text-slate-500 text-sm sm:text-base">{section.subtitle}</p>
                    </div>
                    {section.showViewAll && <Link to={`/shop/${section.id}`} className="inline-flex items-center gap-1 text-rose-500 font-medium hover:text-rose-600">View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>}
                  </div>
                  {sectionProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {sectionProducts.map(product => (
                        <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onQuickView={handleQuickView} onWishlist={handleWishlist} isAdding={addingId === product._id} isInWishlist={wishlist.includes(product._id)} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                      <p className="text-slate-500">No products match your filters</p>
                      <Button variant="ghost" className="mt-4" onClick={() => setFilters({ priceRange: [0, 99999], sizes: [], colors: [], sortBy: 'newest' })}>Clear Filters</Button>
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
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    </div>
                    <p className="text-xs text-slate-600 truncate">{product.name}</p>
                    <p className="text-sm font-semibold text-rose-500">{formatPrice(product.discountedPrice)}</p>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* Trust Badges */}
      <section className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ icon: 'M5 13l4 4L19 7', title: 'Free Shipping', desc: 'On orders over ₹999' }, { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Easy Returns', desc: '10-day return policy' }, { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Secure Payment', desc: '100% secure checkout' }, { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: '24/7 Support', desc: 'Dedicated customer care' }].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg></div>
                <div><h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3><p className="text-sm text-slate-500">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Subscribe for exclusive offers and style inspiration.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-rose-500" required />
            <Button variant="primary" size="lg" type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}