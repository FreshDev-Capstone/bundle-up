import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product } from '@bundle-up/shared-types';
import { Button, Spinner, Badge } from '@bundle-up/ui';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [countVariants, setCountVariants] = useState<Product[]>([]);

  const { addItem } = useCartStore();
  function variantKey(p: Product): string {
    const normalizedName = p.name
      .replace(/\s*-\s*\d+\s*count$/i, '')
      .trim()
      .toLowerCase();
    return [
      normalizedName,
      p.product_color ?? '',
      p.product_size ?? '',
      p.category_id,
      p.farming_method ?? '',
    ].join('::');
  }

  const { user } = useAuthStore();
  const isBusinessContext = location.pathname.startsWith('/nfi');

  const labels = React.useMemo(() => {
    if (!product) return [] as string[];

    const categoryName = (product as Product & { category_name?: string }).category_name;
    const candidates = [categoryName, product.farming_method].filter((value): value is string =>
      Boolean(value),
    );

    if (/\borganic\b/i.test(product.name) || /\borganic\b/i.test(product.slug)) {
      candidates.push('Organic');
    }

    const unique: string[] = [];
    for (const label of candidates) {
      if (!unique.some((existing) => existing.toLowerCase() === label.toLowerCase())) {
        unique.push(label);
      }
    }
    return unique;
  }, [product]);

  useEffect(() => {
    if (!slug) return;
    apiClient.getProduct(slug).then((res) => {
      if (res.success) setProduct(res.data);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (!product) {
      setCountVariants([]);
      return;
    }

    const params: Record<string, string> = { per_page: '100' };
    apiClient.getProducts(params).then((res) => {
      if (!res.success) return;
      const key = variantKey(product);
      const variants = res.data.data
        .filter((item) => variantKey(item) === key)
        .sort((a, b) => Number(a.product_count ?? 0) - Number(b.product_count ?? 0));

      if (variants.length > 1) {
        setCountVariants(variants);
      } else {
        setCountVariants([]);
      }
    });
  }, [product]);

  async function handleAddToCart() {
    if (!user) {
      navigate(isBusinessContext ? '/nfi/login' : '/login', {
        state: { from: { pathname: location.pathname, search: location.search } },
      });
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
            {labels.length > 0 ? (
              labels.map((label) => (
                <Badge
                  key={`${product.id}-${label}`}
                  variant={label === 'Organic' ? 'success' : 'info'}
                >
                  {label}
                </Badge>
              ))
            ) : (
              <Badge variant="success">Eggs</Badge>
            )}
            {!product.is_available && <Badge variant="error">Out of Stock</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(isBusinessContext ? product.b2b_case_price : product.b2c_unit_price)}
            </p>
            <p className="text-sm text-gray-500">{isBusinessContext ? 'per case' : 'per carton'}</p>
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

          {countVariants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Choose Count</p>
              <div className="flex flex-wrap gap-2">
                {countVariants.map((variant) => {
                  const selected = variant.id === product.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `${isBusinessContext ? '/nfi/products' : '/products'}/${variant.slug}`,
                        )
                      }
                      className={`rounded-md border px-3 py-1.5 text-sm ${
                        selected
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:border-green-400'
                      }`}
                    >
                      {variant.product_count} count
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
