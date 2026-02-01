import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navigation({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/cart">Cart</Link>
          <Link to="/admin">Admin Panel</Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ float: 'right' }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ float: 'right' }}>Login</Link>
          <Link to="/register" style={{ float: 'right', marginRight: '1rem' }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navigation;
