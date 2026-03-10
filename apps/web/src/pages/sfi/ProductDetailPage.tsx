import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product } from '@bundle-up/shared-types';
import { Button, Spinner, Badge } from '@bundle-up/ui';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!slug) return;
    apiClient.getProduct(slug).then((res) => {
      if (res.success) setProduct(res.data);
      setLoading(false);
    });
  }, [slug]);

  async function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product) return;
    setAddingToCart(true);
    await addItem(product.id, qty);
    setAddingToCart(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return <div className="p-8 text-center text-gray-500">Product not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-contain p-6"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🥚</div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success">
              {(product as Product & { category_name?: string }).category_name ?? 'Eggs'}
            </Badge>
            {product.farming_method && (
              <Badge variant="info">{product.farming_method}</Badge>
            )}
            {!product.is_available && <Badge variant="error">Out of Stock</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(product.b2c_unit_price)}
            </p>
            <p className="text-sm text-gray-500">per carton</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {product.product_color && (
              <div>
                <span className="font-medium text-gray-700">Color:</span>{' '}
                <span className="text-gray-600 capitalize">{product.product_color}</span>
              </div>
            )}
            {product.product_size && (
              <div>
                <span className="font-medium text-gray-700">Size:</span>{' '}
                <span className="text-gray-600">{product.product_size}</span>
              </div>
            )}
            {product.product_count && (
              <div>
                <span className="font-medium text-gray-700">Count:</span>{' '}
                <span className="text-gray-600">{product.product_count} eggs</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              min={1}
              max={99}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            />
          </div>

          <Button
            onClick={handleAddToCart}
            isLoading={addingToCart}
            disabled={!product.is_available}
            size="lg"
            className="w-full"
          >
            {product.is_available ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}
