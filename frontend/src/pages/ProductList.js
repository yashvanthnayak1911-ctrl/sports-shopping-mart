import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { hapticFeedback } from '../utils/haptics';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // Auto-refresh every 5 seconds to show admin changes
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (category) {
      // If URL has category, filter by it
      const filtered = products.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
      setSearchQuery(''); // Clear search bar when on category page
    } else if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      // Live search filtering
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category?.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, category]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Only show error if we have no products yet
      if (products.length === 0) {
        setError('Failed to load products. Please check your connection.');
      }
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const matchedCategory = products.find(p =>
        p.category?.toLowerCase() === searchQuery.toLowerCase()
      );

      if (matchedCategory) {
        navigate(`/category/${matchedCategory.category.toLowerCase()}`);
      }
    }
  };

  const handleQuantityChange = (productId, change) => {
    hapticFeedback('light');
    setQuantities(prev => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(1, currentQty + change);
      const product = products.find(p => p._id === productId);
      return {
        ...prev,
        [productId]: Math.min(newQty, product?.stock || 0)
      };
    });
  };

  const handleAddToCart = (product) => {
    hapticFeedback('success');
    const quantity = quantities[product._id] || 1;
    addToCart(product, quantity);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="loading" style={{ color: 'red' }}>{error} <br /><button onClick={fetchProducts} className="btn" style={{ marginTop: '1rem', width: 'auto' }}>Retry</button></div>;

  return (
    <div>
      <header className="hero-section">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>SPORTSMART</h1>
          <p>Your Ultimate Destination for Premium Sports Gear & Equipment</p>
        </div>
      </header>
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for gear, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="search-bar"
          />
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h2>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Equipment` : 'Featured Products'}</h2>
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <p>No products found matching "{searchQuery}"</p>
            {/* Hint for admin if database is empty */}
            {products.length === 0 && !loading && (
              <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
                (If you are the admin, go to <a href="/admin" style={{ color: '#ff9800' }}>Admin Panel</a> to add products)
              </p>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/280x220?text=No+Image';
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '220px', background: '#2d2d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '1rem', color: '#666' }}>
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-stock">Stock: {product.stock}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => handleQuantityChange(product._id, -1)}
                    className="quantity-btn"
                    style={{
                      width: '35px',
                      height: '35px',
                      border: '2px solid #ff9800',
                      background: 'white',
                      color: '#ff9800',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '1.2rem', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>
                    {quantities[product._id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product._id, 1)}
                    className="quantity-btn"
                    style={{
                      width: '35px',
                      height: '35px',
                      border: '2px solid #ff9800',
                      background: 'white',
                      color: '#ff9800',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    +
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    className="btn"
                    onClick={() => handleAddToCart(product)}
                    style={{ flex: 1, padding: '0.8rem', fontSize: '1rem' }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      handleAddToCart(product);
                      navigate('/cart');
                    }}
                    style={{ flex: 1, padding: '0.8rem', fontSize: '1rem' }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
