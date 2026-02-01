import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { hapticFeedback } from '../utils/haptics';

function ProductDetails({ addToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (change) => {
        hapticFeedback('light');
        setQuantity(prev => {
            const newQty = Math.max(1, prev + change);
            return Math.min(newQty, product?.stock || 1);
        });
    };

    const handleAddToCart = () => {
        if (product) {
            hapticFeedback('success');
            addToCart(product, quantity);
            // toast is handled in App.js, removed navigation
        }
    };

    const handleBuyNow = () => {
        if (product) {
            hapticFeedback('success');
            addToCart(product, quantity);
            navigate('/cart');
        }
    };

    if (loading) return <div className="loading" style={{ color: 'white' }}>Loading product details...</div>;
    if (!product) return <div className="no-results" style={{ color: 'white' }}>Product not found</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem', color: 'white' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
                style={{
                    marginBottom: '2rem',
                    background: 'transparent',
                    color: '#e0e0e0',
                    border: '1px solid #333',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px'
                }}
            >
                ← Back to Products
            </button>

            <div className="product-details-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                background: '#1e1e1e',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
                <div className="product-image">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '400px',
                            background: '#2d2d2d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            color: '#666'
                        }}>
                            No Image
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h1 style={{
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #e0e0e0, #ffffff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>{product.name}</h1>

                    <p style={{
                        fontSize: '1.1rem',
                        color: '#bbbbbb',
                        lineHeight: '1.6',
                        marginBottom: '2rem'
                    }}>{product.description}</p>

                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#ff9800'
                        }}>${product.price}</span>
                        <span style={{
                            marginLeft: '1rem',
                            color: product.stock > 0 ? '#4caf50' : '#f44336',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '50px'
                        }}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="quantity-btn"
                                style={{
                                    width: '40px', height: '40px',
                                    border: '2px solid #ff9800',
                                    background: 'transparent',
                                    color: '#ff9800',
                                    fontSize: '1.5rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >-</button>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="quantity-btn"
                                style={{
                                    width: '40px', height: '40px',
                                    border: '2px solid #ff9800',
                                    background: 'transparent',
                                    color: '#ff9800',
                                    fontSize: '1.5rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >+</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            style={{
                                flex: 1,
                                opacity: product.stock === 0 ? 0.5 : 1,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        <button
                            className="btn-buy-now"
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                            style={{
                                flex: 1,
                                opacity: product.stock === 0 ? 0.5 : 1,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
