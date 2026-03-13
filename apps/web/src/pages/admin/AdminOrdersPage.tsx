import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Order } from '@bundle-up/shared-types';
import { Spinner, Badge, Button } from '@bundle-up/ui';
import { useAuthStore } from '../../stores/authStore';

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'error',
};

export function AdminOrdersPage() {
  const { token, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<(Order & { user_email?: string; user_role?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filter, setFilter] = useState<'all' | 'b2c' | 'b2b'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ status: string; tracking_number: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;

    setLoading(true);
    setLoadError(null);
    apiClient.getOrders().then((res) => {
      if (res.success) {
        setOrders(res.data.data as (Order & { user_email?: string; user_role?: string })[]);
      } else {
        setLoadError(res.message ?? 'Failed to load orders');
      }
      setLoading(false);
    });
  }, [token, user?.role]);

  const filteredOrders = useMemo(() => {
    const userIdParam = searchParams.get('user_id');
    const userId = userIdParam ? Number(userIdParam) : null;

    let result = orders;
    if (filter === 'b2b') result = result.filter((o) => o.user_role === 'business');
    if (filter === 'b2c') result = result.filter((o) => o.user_role !== 'business');
    if (userId && Number.isFinite(userId)) result = result.filter((o) => o.user_id === userId);
    return result;
  }, [orders, filter, searchParams]);

  const editingOrder = useMemo(
    () => (editingId ? (orders.find((o) => o.id === editingId) ?? null) : null),
    [editingId, orders],
  );

  function startEdit(order: Order & { user_email?: string; user_role?: string }) {
    setSaveError(null);
    setEditingId(order.id);
    setDraft({
      status: order.status,
      tracking_number: (order.tracking_number ?? '') as string,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setSaveError(null);
  }

  async function saveEdit() {
    if (!editingOrder || !draft) return;
    setSaving(true);
    setSaveError(null);

    const res = await apiClient.updateOrderAdmin(editingOrder.id, {
      status: draft.status,
      tracking_number: draft.tracking_number.trim().length ? draft.tracking_number.trim() : null,
    });

    if (!res.success) {
      setSaveError(res.message ?? 'Failed to update order');
      setSaving(false);
      return;
    }

    setOrders((prev) => prev.map((o) => (o.id === editingOrder.id ? { ...o, ...res.data } : o)));
    setSaving(false);
    cancelEdit();
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (loadError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4">
          <Link to="/admin" className="text-sm font-medium text-purple-700 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        <p className="text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        <Link to="/admin" className="text-sm font-medium text-purple-700 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {searchParams.get('user_id') && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-700">Filtered by user</p>
          <Link to="/admin/orders" className="text-sm font-medium text-purple-700 hover:underline">
            Clear filter
          </Link>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'b2c' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('b2c')}
          >
            B2C
          </Button>
          <Button
            variant={filter === 'b2b' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('b2b')}
          >
            B2B
          </Button>
        </div>
      </div>

      {editingOrder && draft && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Editing Order: {editingOrder.order_number}
              </p>
              <p className="text-xs text-gray-500">
                {editingOrder.user_email ?? '—'} • {editingOrder.user_role ?? '—'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={cancelEdit} disabled={saving}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveEdit} isLoading={saving}>
                Save
              </Button>
            </div>
          </div>

          {saveError && <p className="mt-3 text-sm text-red-600">{saveError}</p>}

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={draft.status}
                onChange={(e) => setDraft((d) => (d ? { ...d, status: e.target.value } : d))}
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="processing">processing</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
                <option value="refunded">refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={draft.tracking_number}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, tracking_number: e.target.value } : d))
                }
                placeholder="e.g. 1Z999AA10123456784"
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tracking</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-500" colSpan={9}>
                  No orders found.
                </td>
              </tr>
            )}
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={order.user_role === 'business' ? 'info' : 'default'}>
                    {order.user_role === 'business' ? 'B2B' : 'B2C'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{order.user_email ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[order.status] ?? 'default'}>{order.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{order.tracking_number ?? '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>
                    {order.payment_status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" onClick={() => startEdit(order)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
