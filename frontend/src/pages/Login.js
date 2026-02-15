import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpContact, setOtpContact] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      localStorage.setItem('role', response.data.user.role || 'user');
      setUser(true);
      // Force reload to ensure Navbar updates with new role
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/send-otp', { contact: otpContact });
      alert('OTP sent! Check your server console (since this is a mock).');
      setOtpStep(2);
    } catch (error) {
      console.error('Error sending OTP:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login-otp', {
        contact: otpContact,
        otp: otpCode
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      localStorage.setItem('role', response.data.user.role || 'user');
      setUser(true);
      // Force reload to ensure Navbar updates with new role
      window.location.href = '/';
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>{isOtpLogin ? 'Login with OTP' : 'Login'}</h2>

      {!isOtpLogin ? (
        <form onSubmit={handlePasswordLogin}>
          <input
            type="text"
            name="email"
            placeholder="Email or Mobile Number"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Login with Password
          </button>
        </form>
      ) : (
        <div>
          {otpStep === 1 ? (
            <form onSubmit={handleSendOtp}>
              <input
                type="text"
                placeholder="Email or Mobile Number"
                value={otpContact}
                onChange={(e) => setOtpContact(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
              <button type="submit" className="btn" style={{ width: '100%' }}>
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <p style={{ marginBottom: '1rem' }}>OTP sent to: {otpContact}</p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
              <button type="submit" className="btn" style={{ width: '100%' }}>
                Verify & Login
              </button>
              <button
                type="button"
                onClick={() => setOtpStep(1)}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginTop: '10px', display: 'block' }}
              >
                Change Contact
              </button>
            </form>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          onClick={() => {
            setIsOtpLogin(!isOtpLogin);
            setOtpStep(1);
            setOtpContact('');
            setOtpCode('');
          }}
          style={{
            background: 'transparent',
            border: '2px solid #ff9800',
            color: '#ff9800',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '1rem',
            marginTop: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            width: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 152, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isOtpLogin ? 'Switch to Password Login' : 'Switch to OTP Login'}
        </button>

        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}

export default Login;
