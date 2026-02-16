import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

function App() {
  // Keep-alive mechanism: Ping backend every 5 minutes
  useEffect(() => {
    const pingBackend = async () => {
      try {
        // Use the same env var as axiosConfig
        const backendUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        // Remove /api suffix if present (though usually base url is just the host)
        const baseUrl = backendUrl.replace('/api', '');
        await fetch(`${baseUrl}/ping`);
        console.log('Keep-alive ping sent');
      } catch (error) {
        console.error('Keep-alive ping failed:', error);
      }
    };

    // Initial ping
    pingBackend();

    // Ping every 5 minutes
    const interval = setInterval(pingBackend, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('token') ? true : false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    // Show toast notification
    setToastMessage(`${quantity} × ${product.name} added to cart!`);
    setShowToast(true);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  return (
    <Router>
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Routes>
        <Route path="/" element={<ProductList addToCart={addToCart} />} />
        <Route path="/category/:category" element={<ProductList addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
        <Route path="/checkout" element={<Checkout cart={cart} user={user} setCart={setCart} />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;