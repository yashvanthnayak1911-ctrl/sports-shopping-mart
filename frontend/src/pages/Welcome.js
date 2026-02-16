
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #000000 0%, #5d1313 100%)',
            color: 'white',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                SPORTSMART
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#ccc', maxWidth: '600px' }}>
                Your one-stop destination for premium sports gear. Login or Register to explore our exclusive collection.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '300px' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '1rem',
                        fontSize: '1.1rem',
                        background: '#ff9800',
                        border: 'none',
                        borderRadius: '50px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Login
                </button>

                <button
                    onClick={() => navigate('/register')}
                    style={{
                        padding: '1rem',
                        fontSize: '1.1rem',
                        background: 'transparent',
                        border: '2px solid white',
                        borderRadius: '50px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'white';
                    }}
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default Welcome;
