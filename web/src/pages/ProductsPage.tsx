import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  priceB2B: number;
  category: string;
  type: string;
  imageUrl?: string;
  nutritionalInfo?: Record<string, unknown>;
  certifications?: string[];
  packagingInfo?: Record<string, unknown>;
  shelfLife?: string;
  origin?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'B2C' | 'B2B' | 'ADMIN'>('B2C');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  ).sort();

  // Filter products based on category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesCategory;
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://cold-spoons-argue.loca.lt/api/products');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">Error: {error}</p>
        <button onClick={fetchProducts} className="retry-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Product Store</h1>
        <p className="page-subtitle">Found {filteredProducts.length} products</p>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        <button
          className={`category-button ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* User Type Controls */}
      <div className="controls">
        <div className="user-type-selector">
          <label className={userType === 'B2C' ? 'active' : ''}>
            <input
              type="radio"
              value="B2C"
              checked={userType === 'B2C'}
              onChange={(e) => setUserType(e.target.value as 'B2C')}
            />
            Consumer
          </label>
          <label className={userType === 'B2B' ? 'active' : ''}>
            <input
              type="radio"
              value="B2B"
              checked={userType === 'B2B'}
              onChange={(e) => setUserType(e.target.value as 'B2B')}
            />
            Business
          </label>
          <label className={userType === 'ADMIN' ? 'active' : ''}>
            <input
              type="radio"
              value="ADMIN"
              checked={userType === 'ADMIN'}
              onChange={(e) => setUserType(e.target.value as 'ADMIN')}
            />
            Admin
          </label>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            userType={userType}
            onPress={handleProductPress}
          />
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button onClick={handleCloseModal} className="close-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="modal-details">
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Type:</strong> {selectedProduct.type}</p>
                {userType === 'ADMIN' ? (
                  <div>
                    <p><strong>Retail Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
                    <p><strong>Wholesale Price:</strong> ${selectedProduct.priceB2B.toFixed(2)}</p>
                  </div>
                ) : (
                  <p><strong>Price:</strong> ${userType === 'B2B' ? selectedProduct.priceB2B.toFixed(2) : selectedProduct.price.toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
