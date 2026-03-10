import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product, PaginatedResponse } from '@bundle-up/shared-types';
import { Spinner } from '@bundle-up/ui';

/** B2B product catalog – shows wholesale case pricing */
export function NfiProductsPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') ?? undefined;

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (category) params['category'] = category;
    apiClient.getProducts(params).then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, [category]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Wholesale Catalog</h1>
        <p className="text-blue-600 text-sm mt-1">
          Case pricing shown. All products available in full cases.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.data.map((product) => (
          <Link
            key={product.id}
            to={`/nfi/products/${product.slug}`}
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
              <p className="text-xs text-blue-600 font-medium uppercase mb-1">
                {(product as Product & { category_name?: string }).category_name}
              </p>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(product.b2b_case_price)}
              </p>
              <p className="text-xs text-gray-400">per case</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
