import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../utils/fallbackImages';
import { defaultProducts } from './defaultProducts';

export default function Home({ addToCart }) {
  const products = defaultProducts.map((product, index) => ({
    ...product,
    image_url: getProductImageUrl(product, index),
  }));

  return (
    <div>
      <div className="hero">
        <h1>Welcome to Classic Mobile</h1>
        <p>Shop the latest gadgets, smartphones, and accessories with fast delivery.</p>
        <Link to="/register" className="hero-btn">Browse Gadgets →</Link>
      </div>

      <div className="products-section">
        <h2>Our Products</h2>
        <div className="products-grid">
          {products.map((product, index) => {
            const imageUrl = getProductImageUrl(product, index);
            return (
              <div className="product-card" key={product.id}>
                <img src={imageUrl} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">${parseFloat(product.price).toFixed(2)}</p>
                  <button className="add-to-cart" onClick={() => addToCart(product)}>
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}