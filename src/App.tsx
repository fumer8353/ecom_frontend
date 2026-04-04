import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import { useAuth } from './state/auth'
import { useCart } from './state/cart'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">
          <Link to="/">🍕 Cheezious</Link>
        </div>
        <nav className="nav">
          <Link to="/cart" className="cartLink">
            🛒 Cart
            {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/dashboard">My Orders</Link>
              {user.role === 'admin' ? <Link to="/admin">Admin</Link> : null}
              <button className="linklike" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  )
}

