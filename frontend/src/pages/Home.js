import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost/myshop/api/products.php')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="hero">
        <h1>Welcome to ShopZim</h1>
        <p>Discover amazing products at unbeatable prices</p>
        <Link to="/register" className="hero-btn">Shop Now →</Link>
      </div>

      <div className="products-section">
        <h2>Our Products</h2>
        {loading ? (
          <p style={{textAlign: 'center', color: '#999'}}>Loading products...</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <img src={product.image_url} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">${parseFloat(product.price).toFixed(2)}</p>
                  <button className="add-to-cart" onClick={() => addToCart(product)}>
                    Add to Cart 🛒
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