import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product } from '@bundle-up/shared-types';
import { Spinner, Badge } from '@bundle-up/ui';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getProducts({ per_page: 100 }).then((res) => {
      if (res.success) setProducts(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>
      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">B2C Price</th>
              <th className="px-4 py-3 text-right">B2B Case Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {(p as Product & { category_name?: string }).category_name}
                </td>
                <td className="px-4 py-3 text-right">{formatPrice(p.b2c_unit_price)}</td>
                <td className="px-4 py-3 text-right text-blue-600">{formatPrice(p.b2b_case_price)}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.is_available ? 'success' : 'error'}>
                    {p.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
