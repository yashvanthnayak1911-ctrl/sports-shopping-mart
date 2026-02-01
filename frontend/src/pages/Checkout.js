import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function Checkout({ cart, user, setCart }) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e) => {
    setFormData({
      [e.target.name]: e.target.value
    });
  };

  const handleRemove = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    try {
      // Create Order
      await axios.post('/api/orders/create', {
        userId: localStorage.getItem('userId'),
        items: cart,
        totalAmount: total,
        shippingAddress: formData,
        paymentMethod: paymentMethod
      });

      alert('Order placed successfully!');
      setCart([]); // Clear cart
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
        <h2>Your cart is empty</h2>
        <button className="btn" onClick={() => navigate('/')} style={{ maxWidth: '200px', margin: '2rem auto' }}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Order Summary */}
        <div style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '8px', color: 'white' }}>
          <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1rem' }}>Order Summary</h3>
          {cart.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleRemove(item._id)}
                  style={{
                    background: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  title="Remove item"
                >
                  -
                </button>
                <span>{item.quantity}x {item.name}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#ff9800' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 'none', margin: 0 }}>
          <h3 style={{ marginBottom: '1rem', color: 'white' }}>Shipping Details</h3>
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={formData.street}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem' }}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem' }}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem' }}
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem' }}
          />

          <h3 style={{ marginBottom: '1rem', marginTop: '1.5rem', color: 'white' }}>Payment Method</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: '#2d2d2d', padding: '0.8rem', borderRadius: '6px' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>

            {paymentMethod === 'card' && (
              <div style={{ paddingLeft: '2rem', animation: 'fadeIn 0.3s' }}>
                <input type="text" placeholder="Card Number" style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="MM/YY" style={{ width: '50%', padding: '0.8rem' }} />
                  <input type="text" placeholder="CVV" style={{ width: '50%', padding: '0.8rem' }} />
                </div>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: '#2d2d2d', padding: '0.8rem', borderRadius: '6px' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI (PhonePe, Google Pay, Paytm)
            </label>

            {paymentMethod === 'upi' && (
              <div style={{ paddingLeft: '2rem', animation: 'fadeIn 0.3s' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {['Google Pay', 'PhonePe', 'Paytm'].map((provider) => (
                    <label key={provider} style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: '1px solid #555',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <input
                        type="radio"
                        name="upiProvider"
                        defaultChecked={provider === 'Google Pay'}
                      /> {provider}
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. mobile@upi)"
                  style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem' }}
                />
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: '#2d2d2d', padding: '0.8rem', borderRadius: '6px' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>
            Place Order (${total.toFixed(2)})
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
