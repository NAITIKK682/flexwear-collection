# 🛍️ Flexwear - Modern Full-Stack E-Commerce Platform
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org)

**Flexwear** is a production-ready full-stack e-commerce web application built with React (Vite), Node.js, Express, MongoDB, and TailwindCSS. It provides a seamless shopping experience with user authentication, product browsing by categories (Men, Women, Kids, Accessories), shopping cart, secure checkout with Razorpay, order management, and a comprehensive admin dashboard.

## 🏗️ Project Overview

Flexwear allows users to:
- Browse and filter products across categories
- Manage cart and proceed to checkout with payments
- Track orders and manage profile/addresses
- Admins can manage products, orders, and users

Built for scalability with RESTful APIs, JWT authentication, Cloudinary image storage, and MongoDB with text search.

## ✨ Key Features

- 👤 **User Authentication**: Secure register/login with JWT & role-based access (user/admin)
- 🛒 **Product Catalog**: Category-wise browsing (Men/Women/Kids/Accessories), filters, featured products, search
- 🛍️ **Shopping Cart**: Add/remove items, quantity management, cart summary
- 💳 **Checkout & Payments**: Address management, Razorpay integration, order success tracking
- 📊 **Admin Panel**: CRUD for products/users/orders, dashboard analytics
- 👛 **User Profile**: View orders, manage addresses, personal details
- 🔒 **Security**: Rate limiting, input validation, protected routes, bcrypt hashing
- ⚡ **Performance**: Vite fast builds, Tailwind utility-first CSS, MongoDB indexing

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** (fast dev server/builds)
- **TailwindCSS** (utility-first styling)
- **React Router DOM** (client-side routing)
- **React Hot Toast** (notifications)
- **Axios** (API calls)
- **Zod** (form validation)
- **React Context/Hooks** (state management)

### Backend
- **Node.js** + **Express.js** (REST APIs)
- **MongoDB + Mongoose** (NoSQL database with schemas/indexing)
- **JWT + bcryptjs** (authentication)
- **Cloudinary** (image uploads/storage)
- **Razorpay** (payment gateway)
- **Multer** (file uploads)

### Tools & Utils
- **ESLint/Prettier** (code quality)
- **Nodemon** (dev reload)
- **express-rate-limit/helmet** (security)
- **express-validator** (input sanitization)

## 📁 Folder Structure

```
FLEXWEAR (root)
├── client/
│   ├── public/
│   │   ├── images/
│   │   │   └── hero.png
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── assets/
│   │   │   └── images/
│   │   │       └── placeholder.jpg
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── index.js
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── index.js
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   └── ProductGrid.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── OrderManagement.jsx
│   │   │   │   ├── ProductManagement.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Auth.jsx
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── Cart/
│   │   │   │   ├── Cart.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── Checkout/
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── OrderSuccess.jsx
│   │   │   │   ├── PaymentGateway.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── Home/
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Newsletter.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── ProductDetail/
│   │   │   │   └── index.jsx
│   │   │   ├── Profile/
│   │   │   │   ├── Addresses.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   ├── OrderDetails.jsx
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── PersonalDetails.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── index.jsx
│   │   │   └── Shop/
│   │   │       ├── Accessories.jsx
│   │   │       ├── Kids.jsx
│   │   │       ├── Men.jsx
│   │   │       ├── Shop.jsx
│   │   │       ├── Women.jsx
│   │   │       └── index.jsx
│   │   ├── services/
│   │   │   ├── addressService.js
│   │   │   ├── adminService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   ├── paymentService.js
│   │   │   └── productService.js
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── formatters.js
│   │       └── validators.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   ├── database.js
│   │   │   ├── db.js
│   │   │   └── jwt.js
│   │   ├── controllers/
│   │   │   ├── addressController.js
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   └── productController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Product.js
│   │   │   ├── Review.js
│   │   │   ├── User.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── address.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── cart.routes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── order.routes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── product.routes.js
│   │   │   └── productRoutes.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── jwt.js
│   │   └── validators/
│   │       ├── addressValidator.js
│   │       ├── authValidator.js
│   │       ├── cartValidator.js
│   │       └── productValidator.js
│   ├── server.js
│   └── package.json
├── .gitignore
├── package.json
├── README.md
└── client/src/utils/TODO.md
```

**Notes**: 
- Client: Feature-based structure (components/pages/services/utils)
- Server: MVC pattern with dedicated folders for config/middleware/etc.
- New utilities added: `formatters.js`, `validators.js`, `Loader.jsx`, `Toast.jsx`


## 📄 Important Files

| File | Description |
|------|-------------|
| `client/src/main.jsx` | React entry point, sets up Router + Auth/Cart Providers + Toaster |
| `client/src/App.jsx` | Main app component with routing setup  
| `server/server.js` | Backend server starter, connects MongoDB/Cloudinary, listens on PORT |
| `server/src/app.js` | Express app setup with middleware/routes |
| `server/src/models/Product.js` | Product schema with categories, stock, ratings, text index |
| `server/src/models/User.js` | User model with roles (user/admin), hashed password |
| `server/src/routes/auth.routes.js` | Authentication endpoints (register/login) |
| `client/src/services/api.js` | Base Axios config for all API calls |
| `client/src/context/AuthContext.jsx` | Global auth state management |
| `server/src/middleware/auth.js` | JWT verification middleware |

## 🚀 Installation Guide

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account (test keys)

### Step-by-Step

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flexwear.git
   cd flexwear
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Variables**
   Copy example files or create `.env` in both folders:
   ```bash
   # server/.env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_test_key
   RAZORPAY_KEY_SECRET=your_razorpay_test_secret

   # client/.env (optional for API base)
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY=your_razorpay_test_key
   ```

5. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

   Frontend: http://localhost:5173  
   Backend API: http://localhost:5000

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/products` | Get all products (filters: category, search) | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/cart` | Add to cart | Yes |
| GET | `/api/cart` | Get user cart | Yes |
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders` | Get user orders | Yes |
| POST | `/api/payment/orders` | Create Razorpay order | Yes |
| GET | `/api/admin/products` | Admin: Get all products | Admin |
| POST | `/api/admin/products` | Admin: Create product | Admin |
| PUT | `/api/admin/users/:id` | Admin: Update user | Admin |

**Base URL**: `http://localhost:5000/api`

## 🔮 Future Improvements

- 🛍️ Payment gateway expansion (Stripe/PayPal)
- 📦 Order tracking & delivery status
- ⭐ Advanced admin dashboard (charts, analytics with Recharts)
- 🔍 Elasticsearch for product search
- 📱 Mobile responsiveness improvements (already Tailwind mobile-first)
- 🔔 Real-time notifications (Socket.io)
- 💰 Wishlist functionality
- 🌍 Multi-language support

## 📸 Screenshots

<!-- Add screenshots here -->
![Home Page](./client/public/images/hero.png)
![Product Grid](screenshots/product-grid.png)
![Admin Dashboard](screenshots/admin-dashboard.png)

*Coming soon: Full screenshot gallery*

## 👨‍💻 Author & Credits

**Developed by:** [Your Name](https://github.com/yourusername)  
**Email:** your.email@example.com

**Libraries & Resources:**
- TailwindCSS, Heroicons, React Icons
- Razorpay Documentation
- Cloudinary Uploads

## 📄 License

This project is [MIT](LICENSE) licensed.

---

⭐ **Star this repo if you find it useful!** ⭐

