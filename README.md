# 🛍️ Flexwear — Modern Full-Stack E-Commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org)

---

## 🚀 Overview

**Flexwear** is a **production-ready full-stack e-commerce platform** built with modern technologies like **React (Vite), Node.js, Express, MongoDB, and TailwindCSS**.

It delivers a **seamless shopping experience** with:

* Secure authentication
* Category-based product browsing
* Cart & checkout flow
* Razorpay payment integration
* Admin dashboard

> Designed with scalability, performance, and clean architecture in mind.

---

## ✨ Features

### 👤 User Features

* Secure **JWT Authentication (Login/Register)**
* Browse products by **Men / Women / Kids / Accessories**
* **Search & filter** products
* Add/remove items from cart
* **Checkout with Razorpay**
* Manage **profile & addresses**
* Track orders

### 🛠️ Admin Features

* Product CRUD (Create, Read, Update, Delete)
* Manage users & roles
* Order management
* Dashboard insights

### 🔐 Security & Performance

* Password hashing (**bcrypt**)
* Protected routes (JWT middleware)
* Rate limiting & API security
* Optimized builds via **Vite**
* MongoDB indexing for fast queries

---

## 🧱 Tech Stack

### 🎨 Frontend

* React 18 + Vite
* TailwindCSS
* React Router DOM
* Axios
* React Hot Toast
* Zod Validation
* Context API + Hooks

### ⚙️ Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Cloudinary (image uploads)
* Razorpay (payments)
* Multer (file handling)

### 🧰 Tools

* ESLint + Prettier
* Nodemon
* Helmet + Rate Limiter
* Express Validator

---

## 📁 Project Structure

### 📦 Root

```
FLEXWEAR/
├── client/     # Frontend (React)
├── server/     # Backend (Node + Express)
├── README.md
└── package.json
```

---

### 🎨 Client (Frontend)

```
client/src/
├── components/
│   ├── common/        # Loader, Toast
│   ├── cart/          # Cart UI
│   ├── layout/        # Navbar, Footer
│   └── product/       # Product UI
├── pages/             # All pages (Auth, Cart, Checkout, Admin, etc.)
├── context/           # Global state (Auth, Cart)
├── hooks/             # Custom hooks
├── services/          # API calls
├── utils/             # Helpers & validators
```

---

### ⚙️ Server (Backend)

```
server/src/
├── config/        # DB, Cloudinary, JWT
├── controllers/   # Business logic
├── middleware/    # Auth, Rate limiter
├── models/        # Mongoose schemas
├── routes/        # API routes
├── validators/    # Input validation
└── utils/         # Helpers
```

---

## 📄 Important Files

| File                  | Purpose         |
| --------------------- | --------------- |
| `client/src/main.jsx` | App entry point |
| `client/src/App.jsx`  | Routing setup   |
| `server/server.js`    | Server start    |
| `server/src/app.js`   | Express config  |
| `Product.js`          | Product schema  |
| `User.js`             | User model      |
| `auth.routes.js`      | Auth APIs       |
| `api.js`              | Axios config    |
| `AuthContext.jsx`     | Auth state      |
| `auth.js`             | JWT middleware  |

---

## ⚡ Installation

### 🔧 Prerequisites

* Node.js (18+)
* MongoDB Atlas / Local DB
* Cloudinary account
* Razorpay account

---

### 📥 Setup Steps

#### 1. Clone Repo

```bash
git clone https://github.com/yourusername/flexwear.git
cd flexwear
```

#### 2. Backend Setup

```bash
cd server
npm install
```

#### 3. Frontend Setup

```bash
cd client
npm install
```

---

### 🔑 Environment Variables

#### server/.env

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
```

#### client/.env

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_key
```

---

### ▶️ Run Project

```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

## 🔌 API Endpoints

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| POST   | `/auth/register`  | Register       |
| POST   | `/auth/login`     | Login          |
| GET    | `/products`       | Get products   |
| GET    | `/products/:id`   | Single product |
| POST   | `/cart`           | Add to cart    |
| GET    | `/cart`           | Get cart       |
| POST   | `/orders`         | Create order   |
| GET    | `/orders`         | User orders    |
| POST   | `/payment/orders` | Razorpay order |

---

## 📸 Screenshots

```md
![Home](./client/public/images/hero.png)
![Products](screenshots/product-grid.png)
![Admin](screenshots/admin-dashboard.png)
```

---

## 🔮 Future Enhancements

* Stripe / PayPal integration
* Real-time notifications (Socket.io)
* Wishlist feature
* Advanced analytics dashboard
* Elasticsearch search
* Multi-language support

---

## 👨‍💻 Author

**Your Name**
GitHub: https://github.com/yourusername

---

## 📜 License

MIT License © 2026

---

## ⭐ Support

If you like this project:

👉 Star the repo
👉 Share with others

**Built with ❤️ using MERN Stack**
