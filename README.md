# 🛍️ Flexwear — Modern Full-Stack E-Commerce Platform

<p align="center">
  <b>Production-Ready MERN Stack E-Commerce Application</b><br/>
  <i>Clean Architecture • Scalable • Real-World Project</i>
</p>

---

## 🚀 Overview

**Flexwear** is a **full-stack e-commerce web application** built using modern technologies like **React (Vite), Node.js, Express, MongoDB, and TailwindCSS**.

This project is designed to replicate a **real-world e-commerce system** with:

* 🛒 Complete shopping experience
* 🔐 Secure authentication
* 💳 Payment integration (Razorpay)
* 📦 Order management system
* 🛠️ Admin dashboard

---

## ✨ Features

### 👤 User Features

* JWT-based authentication (Login / Register)
* Browse products by categories (Men, Women, Kids, Accessories)
* Product search & filtering
* Add to cart & manage quantity
* Checkout with address system
* Razorpay payment integration
* Order tracking & history

---

### 🛠️ Admin Features

* Product CRUD operations
* User management
* Order management dashboard

---

### 🔐 Security & Performance

* Password hashing using bcrypt
* Protected routes with JWT middleware
* Rate limiting & API security
* Fast builds with Vite
* MongoDB indexing

---

## 🧱 Tech Stack

### Frontend

* React 18 + Vite
* TailwindCSS
* React Router DOM
* Axios
* React Hot Toast
* Zod Validation
* Context API

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Cloudinary (image uploads)
* Razorpay (payments)
* Multer

---

## 🧠 Architecture

```
Frontend (React)
   ↓
API Layer (Axios Services)
   ↓
Backend (Express)
   ↓
Database (MongoDB)
   ↓
External Services (Cloudinary, Razorpay)
```

---

## 📁 Complete Folder Structure

```bash
FLEXWEAR/
│
├── client/                          # 🎨 Frontend
│   ├── public/
│   │   ├── images/
│   │   │   └── hero.png
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │
│   │   ├── assets/
│   │   │   └── images/
│   │   │       └── placeholder.jpg
│   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   └── ProductFilter.jsx
│   │   │   │
│   │   │   └── ProtectedRoute.jsx
│   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ProductManagement.jsx
│   │   │   │   ├── OrderManagement.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   └── index.jsx
│   │   │
│   │   │   ├── Auth/
│   │   │   │   ├── Auth.jsx
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── index.jsx
│   │   │
│   │   │   ├── Cart/
│   │   │   │   ├── Cart.jsx
│   │   │   │   └── index.jsx
│   │   │
│   │   │   ├── Checkout/
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── PaymentGateway.jsx
│   │   │   │   ├── OrderSuccess.jsx
│   │   │   │   └── index.jsx
│   │   │
│   │   │   ├── Home/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── Newsletter.jsx
│   │   │   │   └── index.jsx
│   │   │
│   │   │   ├── ProductDetail/
│   │   │   │   └── index.jsx
│   │   │
│   │   │   ├── Profile/
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── PersonalDetails.jsx
│   │   │   │   ├── Addresses.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   ├── OrderDetails.jsx
│   │   │   │   └── index.jsx
│   │   │
│   │   │   └── Shop/
│   │   │       ├── Shop.jsx
│   │   │       ├── Men.jsx
│   │   │       ├── Women.jsx
│   │   │       ├── Kids.jsx
│   │   │       ├── Accessories.jsx
│   │   │       └── index.jsx
│   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   ├── paymentService.js
│   │   │   ├── addressService.js
│   │   │   └── adminService.js
│   │
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── formatters.js
│   │       └── validators.js
│
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/                          # ⚙️ Backend
│   ├── src/
│   │   ├── app.js
│   │
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── db.js
│   │   │   ├── cloudinary.js
│   │   │   └── jwt.js
│   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   └── addressController.js
│   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimiter.js
│   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Review.js
│   │   │   └── index.js
│   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── cart.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── address.routes.js
│   │   │   └── legacy files
│   │
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── jwt.js
│   │
│   │   └── validators/
│   │       ├── authValidator.js
│   │       ├── productValidator.js
│   │       ├── cartValidator.js
│   │       └── addressValidator.js
│
│   ├── server.js
│   └── package.json
│
├── README.md
└── package.json
```

---

## ⚡ Setup & Run

```bash
# Install
cd server && npm install
cd ../client && npm install

# Run
cd server && npm run dev
cd client && npm run dev
```

---

## 👨‍💻 Author

**Naitik Kushwaha**
GitHub: https://github.com/NAITIKK682

---

## ⭐ Support

If you like this project, give it a ⭐
