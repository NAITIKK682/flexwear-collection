import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/Checkout/OrderSuccess'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import { Navbar, Footer } from './components/layout'
import ProtectedRoute from './components/ProtectedRoute' // 👈 Added only for admin route protection

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Shop category="men" />} />
          <Route path="/women" element={<Shop category="women" />} />
          <Route path="/kids" element={<Shop category="kids" />} />
          <Route path="/accessories" element={<Shop category="accessories" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App