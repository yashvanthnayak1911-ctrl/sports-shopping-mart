
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

function Settings({ setUser }) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        mobile: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUserData({
                name: response.data.name,
                email: response.data.email,
                mobile: response.data.mobile || ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setUser(false);
        navigate('/');
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/auth/update', userData);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile.');
        }
    };

    if (loading) return <div className="container" style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading settings...</div>;

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Account Settings</h2>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    background: message.includes('success') ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                    color: message.includes('success') ? '#28a745' : '#dc3545',
                    textAlign: 'center'
                }}>
                    {message}
                </div>
            )}

            <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#ff9800' }}>Profile Details</h3>

                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.8rem', background: '#2d2d2d', border: '1px solid #444', borderRadius: '6px', color: 'white' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Email (Read-only)</label>
                        <input
                            type="email"
                            value={userData.email}
                            disabled
                            style={{ width: '100%', padding: '0.8rem', background: '#252525', border: '1px solid #333', borderRadius: '6px', color: '#888', cursor: 'not-allowed' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={userData.mobile}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.8rem', background: '#2d2d2d', border: '1px solid #444', borderRadius: '6px', color: 'white' }}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ marginBottom: '2rem' }}>Update Profile</button>
                </form>

                <div style={{ borderTop: '1px solid #333', paddingTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#dc3545' }}>Danger Zone</h3>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'rgba(220, 53, 69, 0.1)',
                            border: '1px solid #dc3545',
                            color: '#dc3545',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(220, 53, 69, 0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(220, 53, 69, 0.1)'}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
