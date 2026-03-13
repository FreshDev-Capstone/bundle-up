import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { Badge, Spinner, Card, CardHeader, CardBody, Button } from '@bundle-up/ui';
import type { Order, User, UserRole } from '@bundle-up/shared-types';
import { useAuthStore } from '../../stores/authStore';

type AdminUserRow = User & {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  company_name?: string | null;
  is_approved?: boolean | null;
};

function roleLabel(role: UserRole) {
  if (role === 'business') return 'B2B';
  if (role === 'customer') return 'B2C';
  return 'Admin';
}

export function AdminUsersPage() {
  const { token, user } = useAuthStore();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const [orders, setOrders] = useState<(Order & { user_email?: string; user_role?: string })[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);
  const [createAdminSuccess, setCreateAdminSuccess] = useState<string | null>(null);

  const [resetEmail, setResetEmail] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient.getUsersAdmin().then((res) => {
      if (cancelled) return;
      if (!res.success) {
        setError(res.message ?? 'Failed to load users');
        setLoading(false);
        return;
      }
      setUsers(res.data);
      setLoading(false);
    });

    apiClient.getOrders().then((res) => {
      if (cancelled) return;
      if (!res.success) {
        setOrdersError(res.message ?? 'Failed to load orders');
        return;
      }
      setOrders((res.data.data ?? []) as (Order & { user_email?: string; user_role?: string })[]);
    });
    return () => {
      cancelled = true;
    };
  }, [token, user?.role]);

  const recentOrdersByUser = useMemo(() => {
    const map = new Map<number, Order[]>();
    for (const o of orders) {
      const arr = map.get(o.user_id) ?? [];
      arr.push(o);
      map.set(o.user_id, arr);
    }
    for (const [userId, arr] of map.entries()) {
      arr.sort((a, b) => {
        const at = new Date(a.created_at).getTime();
        const bt = new Date(b.created_at).getTime();
        return bt - at;
      });
      map.set(userId, arr.slice(0, 5));
    }
    return map;
  }, [orders]);

  const b2cUsers = useMemo(() => users.filter((u) => u.role === 'customer'), [users]);
  const b2bUsers = useMemo(() => users.filter((u) => u.role === 'business'), [users]);
  const adminUsers = useMemo(() => users.filter((u) => u.role === 'admin'), [users]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4">
          <Link to="/admin" className="text-sm font-medium text-purple-700 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  async function refreshUsers() {
    const res = await apiClient.getUsersAdmin();
    if (res.success) setUsers(res.data);
  }

  async function setUserActive(targetUserId: number, nextActive: boolean) {
    setActionError(null);
    setUpdatingUserId(targetUserId);
    const res = await apiClient.updateUserAdmin(targetUserId, { is_active: nextActive });
    setUpdatingUserId(null);

    if (!res.success) {
      setActionError(res.message ?? 'Failed to update user');
      return;
    }

    setUsers((prev) => prev.map((u) => (u.id === targetUserId ? { ...u, ...res.data } : u)));
  }

  async function onCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setCreateAdminError(null);
    setCreateAdminSuccess(null);
    setResetLink(null);

    if (!newAdminEmail.trim() || !newAdminPassword) {
      setCreateAdminError('Email and password are required.');
      return;
    }

    setCreatingAdmin(true);
    const res = await apiClient.adminCreateAdminUser({
      email: newAdminEmail.trim(),
      password: newAdminPassword,
    });
    setCreatingAdmin(false);

    if (!res.success) {
      setCreateAdminError(res.message ?? 'Failed to create admin user');
      return;
    }

    setCreateAdminSuccess(`Created admin: ${res.data.user.email}`);
    setNewAdminEmail('');
    setNewAdminPassword('');
    await refreshUsers();
  }

  async function onGenerateResetLink(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);
    setResetLink(null);
    setCreateAdminSuccess(null);

    if (!resetEmail.trim()) {
      setResetError('Email is required.');
      return;
    }

    setResetting(true);
    const res = await apiClient.adminRequestPasswordReset({ email: resetEmail.trim() });
    setResetting(false);

    if (!res.success) {
      setResetError(res.message ?? 'Failed to generate reset link');
      return;
    }

    setResetLink(res.data.reset_url);
  }

  const renderTable = (
    rows: AdminUserRow[],
    opts?: { showActions?: boolean; showRecentOrders?: boolean },
  ) => {
    const showActions = opts?.showActions ?? false;
    const showRecentOrders = opts?.showRecentOrders ?? true;
    return (
      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
              {showRecentOrders && <th className="px-4 py-3">Recent Orders</th>}
              <th className="px-4 py-3">Created</th>
              {showActions && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-sm text-gray-500"
                  colSpan={(showActions ? 1 : 0) + (showRecentOrders ? 1 : 0) + 6}
                >
                  No users found.
                </td>
              </tr>
            )}
            {rows.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.email}</td>
                <td className="px-4 py-3 text-gray-700">
                  {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === 'business' ? 'info' : 'default'}>
                    {roleLabel(u.role)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{u.company_name ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={u.is_active ? 'success' : 'error'}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {u.role === 'business' && (
                      <Badge variant={u.is_approved ? 'success' : 'warning'}>
                        {u.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                    )}
                  </div>
                </td>
                {showRecentOrders && (
                  <td className="px-4 py-3">
                    <details>
                      <summary className="cursor-pointer select-none text-sm font-medium text-purple-700 hover:underline">
                        View recent
                      </summary>
                      <div className="mt-2 space-y-2">
                        <div className="rounded-md border border-gray-200 bg-white p-3">
                          {(recentOrdersByUser.get(u.id) ?? []).length === 0 ? (
                            <p className="text-xs text-gray-500">No orders found.</p>
                          ) : (
                            <ul className="space-y-1">
                              {(recentOrdersByUser.get(u.id) ?? []).map((o) => (
                                <li key={o.id} className="text-xs text-gray-700">
                                  <span className="font-mono">{o.order_number}</span> • {o.status} • $
                                  {Number(o.total).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="mt-2">
                            <Link
                              to={`/admin/orders?user_id=${u.id}`}
                              className="text-xs font-medium text-purple-700 hover:underline"
                            >
                              View all orders
                            </Link>
                          </div>
                        </div>
                      </div>
                    </details>
                  </td>
                )}
                <td className="px-4 py-3 text-gray-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                {showActions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={u.is_active ? 'danger' : 'secondary'}
                        isLoading={updatingUserId === u.id}
                        disabled={u.id === user?.id}
                        onClick={() => setUserActive(u.id, !u.is_active)}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      {u.id === user?.id && <span className="text-xs text-gray-500">(You)</span>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        <Link to="/admin" className="text-sm font-medium text-purple-700 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Admin Tools</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form onSubmit={onCreateAdmin} className="space-y-3">
              <p className="text-sm font-medium text-gray-900">Create admin account</p>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temporary password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Min 8 characters"
                />
              </div>
              {createAdminError && <p className="text-sm text-red-600">{createAdminError}</p>}
              {createAdminSuccess && <p className="text-sm text-green-700">{createAdminSuccess}</p>}
              <Button type="submit" size="sm" isLoading={creatingAdmin}>
                Create admin
              </Button>
            </form>

            <form onSubmit={onGenerateResetLink} className="space-y-3">
              <p className="text-sm font-medium text-gray-900">Generate password reset link</p>
              <div>
                <label className="block text-sm font-medium text-gray-700">User email</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              {resetError && <p className="text-sm text-red-600">{resetError}</p>}
              {resetLink && (
                <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-700">Reset link</p>
                  <a
                    href={resetLink}
                    className="mt-1 block break-all text-xs text-purple-700 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {resetLink}
                  </a>
                </div>
              )}
              <Button type="submit" size="sm" variant="secondary" isLoading={resetting}>
                Generate link
              </Button>
            </form>
          </div>

          {ordersError && <p className="mt-4 text-sm text-amber-700">{ordersError}</p>}
          {actionError && <p className="mt-4 text-sm text-red-600">{actionError}</p>}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
              <span className="text-sm text-gray-500">{adminUsers.length}</span>
            </div>
          </CardHeader>
          <CardBody>
            <p className="mb-3 text-xs text-gray-500">
              Deactivating an admin revokes access immediately.
            </p>
            {renderTable(adminUsers, { showActions: true, showRecentOrders: false })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">B2C Customers</h2>
              <span className="text-sm text-gray-500">{b2cUsers.length}</span>
            </div>
          </CardHeader>
          <CardBody>{renderTable(b2cUsers)}</CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">B2B Customers</h2>
              <span className="text-sm text-gray-500">{b2bUsers.length}</span>
            </div>
          </CardHeader>
          <CardBody>{renderTable(b2bUsers)}</CardBody>
        </Card>
      </div>
    </div>
  );
}
