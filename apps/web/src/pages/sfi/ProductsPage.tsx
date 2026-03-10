import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product, PaginatedResponse } from '@bundle-up/shared-types';
import { Spinner } from '@bundle-up/ui';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') ?? undefined;
  const search = searchParams.get('search') ?? undefined;

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (category) params['category'] = category;
    if (search) params['search'] = search;

    apiClient.getProducts(params).then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, [category, search]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {category ? `${category.replace(/-/g, ' ')} Eggs` : 'All Products'}
      </h1>
      <p className="text-gray-500 mb-8">
        {data?.total ?? 0} products
      </p>

      {data && data.data.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-square bg-gray-50 overflow-hidden">
                {product.primary_image ? (
                  <img
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🥚</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-green-600 font-medium uppercase mb-1">
                  {(product as Product & { category_name?: string }).category_name ?? product.product_color}
                </p>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(product.b2c_unit_price)}
                </p>
                <p className="text-xs text-gray-400">per carton</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
