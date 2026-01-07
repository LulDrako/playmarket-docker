import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Games from './pages/Games'
import GameDetail from './pages/GameDetail'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="games" element={<Games />} />
              <Route path="games/:id" element={<GameDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
