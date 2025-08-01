import React from 'react';

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

interface ProductCardProps {
  product: Product;
  userType?: 'B2C' | 'B2B' | 'ADMIN';
  onPress?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userType = 'B2C', onPress }) => {
  // Generate a placeholder image URL based on product category and color
  const getPlaceholderImage = () => {
    const colors = ['8B4513', 'DEB887', 'F5DEB3', 'CD853F']; // Brown tones for eggs
    const colorIndex = (product.id || 0) % colors.length;
    return `https://via.placeholder.com/200x150/${colors[colorIndex]}/FFFFFF?text=${encodeURIComponent('Egg')}`;
  };

  const getImageSource = () => {
    // Handle relative URLs by making them absolute or use placeholder
    if (!product.imageUrl || product.imageUrl.startsWith('/')) {
      return getPlaceholderImage();
    }
    return product.imageUrl;
  };

  // Determine which price to show based on user account type
  const getDisplayPrice = () => {
    switch (userType) {
      case 'B2B':
        return product.priceB2B.toFixed(2);
      case 'B2C':
      default:
        return product.price.toFixed(2);
    }
  };

  const getPriceLabel = () => {
    switch (userType) {
      case 'B2B':
        return 'Wholesale';
      case 'B2C':
        return 'Retail';
      default:
        return '';
    }
  };

  const handleClick = () => {
    onPress?.(product);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        <img 
          src={getImageSource()} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage();
          }}
        />
        <button className="add-button" onClick={(e) => { e.stopPropagation(); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {/* Admin users see both prices */}
        {userType === 'ADMIN' ? (
          <div className="admin-price-container">
            <span className="admin-price">
              Retail: ${product.price.toFixed(2)} | Wholesale: ${product.priceB2B.toFixed(2)}
            </span>
          </div>
        ) : (
          <div className="price-container">
            {getPriceLabel() && (
              <span className="price-label">{getPriceLabel()}</span>
            )}
            <span className="price">${getDisplayPrice()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
