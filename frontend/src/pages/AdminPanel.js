import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

function AdminPanel({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to access admin panel');
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/auth/me');
        if (response.data.role !== 'admin') {
          alert('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // alert('Authentication failed. Please login again.'); // Removed to prevent annoying popups
        navigate('/login');
      }
    };

    checkAdmin();
    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    // Disable background animations on admin page
    document.body.classList.add('admin-page');

    return () => {
      // Re-enable animations when leaving admin page
      document.body.classList.remove('admin-page');
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please login as admin to access this page</div>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert price and stock to numbers
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (!data.price || !data.stock) {
        setError('Please fill in all required fields');
        return;
      }

      console.log('Submitting product data:', data);

      if (editingId) {
        // Update existing product
        const response = await axios.put(`/api/admin/products/${editingId}`, data);
        console.log('Product updated response:', response.data);
        alert('Product updated successfully!');
        setEditingId(null);
      } else {
        // Add new product
        const response = await axios.post('/api/admin/products/add', data);
        console.log('Product added response:', response.data);
        alert('Product added successfully!');
      }

      setError('');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: ''
      });
      // Refresh products list
      fetchProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error saving product';
      console.error('Error saving product:', errorMsg);
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image || '',
      stock: product.stock.toString()
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: ''
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/products/${productId}`);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Panel</h2>
        <button
          onClick={() => window.location.href = '/home'}
          className="btn"
          style={{ padding: '0.5rem 1rem', background: '#28a745' }}
        >
          View Live Shop
        </button>
      </div>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              category: '',
              image: '',
              stock: ''
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn"
          style={{ padding: '0.8rem 1.5rem', background: '#007bff', fontSize: '1rem' }}
        >
          + Add New Product
        </button>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: '3rem'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#fff' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        {error && <div style={{ color: 'red', padding: '1rem', marginBottom: '1rem', background: '#fee', borderRadius: '4px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)' }}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)' }}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={handleChange}
              required
              style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)' }}
            />
          </div>
          <input
            type="text"
            name="image"
            placeholder="Image URL (required)"
            value={formData.image}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', minHeight: '100px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
          />

          {formData.image && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.9rem', color: '#333', margin: '0 0 0.5rem 0' }}>Image Preview:</p>
              <img
                src={formData.image}
                alt="preview"
                style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn" style={{ background: editingId ? '#ffc107' : '#28a745', color: editingId ? '#000' : '#fff', padding: '0.8rem 2rem' }}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn" style={{ background: '#dc3545' }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Manage Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <p>No products added yet</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/280x220?text=No+Image';
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '220px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '1rem' }}>
                    <span style={{ color: '#999' }}>No Image</span>
                  </div>
                )}
                <h3>{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-stock">Stock: {product.stock}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleEditProduct(product)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 1rem',
                      background: 'rgba(40, 167, 69, 0.2)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(40, 167, 69, 0.3)',
                      borderRadius: '25px',
                      color: '#28a745',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(40, 167, 69, 0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(40, 167, 69, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 1rem',
                      background: 'rgba(220, 53, 69, 0.2)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(220, 53, 69, 0.3)',
                      borderRadius: '25px',
                      color: '#dc3545',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(220, 53, 69, 0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Delete
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

export default AdminPanel;
