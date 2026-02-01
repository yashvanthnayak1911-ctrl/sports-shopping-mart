import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

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

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      {product.image && <img src={product.image} alt={product.name} style={{ maxWidth: '400px' }} />}
      <p>{product.description}</p>
      <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#ff9800' }}>${product.price}</p>
      <p>Stock: {product.stock}</p>
      <button className="btn" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetail;
