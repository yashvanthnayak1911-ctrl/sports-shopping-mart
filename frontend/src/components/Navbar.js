import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartCount = 0 }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);
  const glassButtonStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontWeight: '500'
  };

  return (
    <nav style={{ background: 'linear-gradient(135deg, #000000 0%, #5d1313 100%)', padding: '1rem 2rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>
            SPORTSMART
          </Link>
          <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '1rem' }}>
            (Role: {localStorage.getItem('role') || 'none'})
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={glassButtonStyle} onMouseEnter={(e) => {
            e.target.style.background = 'rgba(135, 18, 18, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}>Home</Link>
          <Link to="/cart" style={{ ...glassButtonStyle, position: 'relative' }} onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}>
            Cart
            {cartCount > 0 && (
              <span className={`cart-badge ${animate ? 'cart-badge-animate' : ''}`}>
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/orders" style={{ ...glassButtonStyle }} onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}>Orders</Link>
          <Link to="/login" style={glassButtonStyle} onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}>Login</Link>
          <Link to="/register" style={glassButtonStyle} onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}>Register</Link>
          {localStorage.getItem('role') === 'admin' && (
            <Link to="/admin" style={glassButtonStyle} onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}>Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;