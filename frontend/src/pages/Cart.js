import React from 'react';
import { hapticFeedback } from '../utils/haptics';

import { useNavigate } from 'react-router-dom';

function Cart({ cart, removeFromCart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemove = (productId) => {
    hapticFeedback('medium');
    removeFromCart(productId);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            {cart.map(item => (
              <div key={item._id} className="cart-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', backgroundColor: 'white', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120x120?text=No+Image';
                    }}
                  />
                ) : (
                  <div style={{ width: '120px', height: '120px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>No Image</span>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3>{item.name}</h3>
                  <p style={{ color: '#666' }}>Price: ${item.price}</p>
                  <p style={{ color: '#ff9800', fontWeight: '600' }}>Quantity: {item.quantity}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="btn btn-glass-danger"
                  onClick={() => handleRemove(item._id)}
                  style={{ minWidth: '100px' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button
            className="btn"
            style={{ fontSize: '1.2em', padding: '1rem 2rem' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
