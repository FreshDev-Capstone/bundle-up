import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import type { OrderWithItems } from '@bundle-up/shared-types';
import { Badge, Spinner } from '@bundle-up/ui';
import { formatPrice } from '@bundle-up/utils';

interface OrderDetailPageProps {
  variant?: 'sfi' | 'nfi';
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'error',
};

export function OrderDetailPage({ variant = 'sfi' }: OrderDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  const ordersRoute = variant === 'nfi' ? '/nfi/orders' : '/orders';
  const productsRoute = variant === 'nfi' ? '/nfi/products' : '/products';
  const confirmed = searchParams.get('confirmed') === '1';

  useEffect(() => {
    if (!id) return;
    apiClient.getOrder(Number(id)).then((res) => {
      if (res.success) setOrder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <Link to={ordersRoute} className="text-green-700 hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      {confirmed && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Order confirmed. Thank you for your purchase.
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Order {order.order_number}</h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <Badge variant={statusVariants[order.status] ?? 'default'}>{order.status}</Badge>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.product.primary_image ? (
                  <img
                    src={item.product.primary_image}
                    alt={item.product.name}
                    className="h-12 w-12 rounded bg-gray-50 object-contain p-1"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-50 flex items-center justify-center">
                    🥚
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(Number(item.line_total))}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Totals</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(Number(order.tax))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{formatPrice(Number(order.shipping))}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <Link to={ordersRoute} className="text-green-700 hover:underline">
          Back to Orders
        </Link>
        <Link to={productsRoute} className="text-green-700 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
