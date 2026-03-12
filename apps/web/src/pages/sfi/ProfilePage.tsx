import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Address, Order, OrderWithItems } from '@bundle-up/shared-types';
import { Badge, Button, Spinner } from '@bundle-up/ui';
import { apiClient } from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '@bundle-up/utils';

type PaymentDraft = {
  label: string;
  cardholder: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  is_default: boolean;
};

type PaymentMethod = PaymentDraft & { id: number };

const emptyAddress = {
  label: '',
  street_line1: '',
  street_line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  is_default: false,
};

const emptyPayment: PaymentDraft = {
  label: '',
  cardholder: '',
  brand: '',
  last4: '',
  expMonth: '',
  expYear: '',
  is_default: false,
};

interface ProfilePageProps {
  variant?: 'sfi' | 'nfi';
}

export function ProfilePage({ variant = 'sfi' }: ProfilePageProps) {
  const { user, profile, businessAccount, applyMe, refreshMe } = useAuthStore();
  const { clearCart, addItem } = useCartStore();

  const paymentStorageKey = variant === 'nfi' ? 'bundle-up-payment-nfi' : 'bundle-up-payment-sfi';

  const [accountDraft, setAccountDraft] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    tax_id: '',
    billing_email: '',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraft>(emptyPayment);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [passwordDraft, setPasswordDraft] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressDraft, setAddressDraft] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [reorderingOrderId, setReorderingOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isBusiness = user?.role === 'business';

  const profileRoute = variant === 'nfi' ? '/nfi/profile' : '/profile';
  const ordersRoute = variant === 'nfi' ? '/nfi/orders' : '/orders';
  const cartRoute = variant === 'nfi' ? '/nfi/cart' : '/cart';

  useEffect(() => {
    const saved = localStorage.getItem(paymentStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as unknown;

        // New format: array of methods
        if (Array.isArray(parsed)) {
          const methods: PaymentMethod[] = parsed
            .map((item) => item as Partial<PaymentMethod>)
            .filter((item) => typeof item.id === 'number')
            .map((item) => ({
              id: item.id as number,
              label: String(item.label ?? ''),
              cardholder: String(item.cardholder ?? ''),
              brand: String(item.brand ?? ''),
              last4: String(item.last4 ?? ''),
              expMonth: String(item.expMonth ?? ''),
              expYear: String(item.expYear ?? ''),
              is_default: Boolean(item.is_default),
            }));

          const hasDefault = methods.some((m) => m.is_default);
          const normalized = hasDefault
            ? methods
            : methods.map((m, idx) => ({ ...m, is_default: idx === 0 }));

          setPaymentMethods(normalized);
          setPaymentDraft(emptyPayment);
          setEditingPaymentId(null);
          return;
        }

        // Old format: a single draft object. Migrate to a single default method.
        if (parsed && typeof parsed === 'object') {
          const legacy = parsed as Partial<PaymentDraft>;
          const migrated: PaymentMethod = {
            id: Date.now(),
            label: legacy.label ? String(legacy.label) : 'Card',
            cardholder: String(legacy.cardholder ?? ''),
            brand: String(legacy.brand ?? ''),
            last4: String(legacy.last4 ?? ''),
            expMonth: String(legacy.expMonth ?? ''),
            expYear: String(legacy.expYear ?? ''),
            is_default: true,
          };
          setPaymentMethods([migrated]);
          localStorage.setItem(paymentStorageKey, JSON.stringify([migrated]));
          setPaymentDraft(emptyPayment);
          setEditingPaymentId(null);
        }
      } catch {
        setPaymentMethods([]);
        setPaymentDraft(emptyPayment);
        setEditingPaymentId(null);
      }
    }
  }, [paymentStorageKey]);

  useEffect(() => {
    if (!user || !profile) return;

    setAccountDraft({
      email: user.email ?? '',
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      phone: profile.phone ?? '',
      company_name: businessAccount?.company_name ?? '',
      tax_id: businessAccount?.tax_id ?? '',
      billing_email: businessAccount?.billing_email ?? '',
    });
  }, [user, profile, businessAccount]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      await refreshMe();
      const [addressesRes, ordersRes] = await Promise.all([
        apiClient.getAddresses(),
        apiClient.getOrders(),
      ]);

      if (!mounted) return;

      if (addressesRes.success) {
        setAddresses(addressesRes.data);
      }
      if (ordersRes.success) {
        setOrders(ordersRes.data.data);
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [refreshMe]);

  const canSaveAccount = useMemo(() => {
    return Boolean(accountDraft.email && accountDraft.first_name && accountDraft.last_name);
  }, [accountDraft]);

  async function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveAccount) return;

    setSavingAccount(true);
    setMessage(null);

    const res = await apiClient.updateMe({
      email: accountDraft.email,
      first_name: accountDraft.first_name,
      last_name: accountDraft.last_name,
      phone: accountDraft.phone,
      company_name: isBusiness ? accountDraft.company_name : undefined,
      tax_id: isBusiness ? accountDraft.tax_id : undefined,
      billing_email: isBusiness ? accountDraft.billing_email : undefined,
    });

    if (res.success) {
      applyMe(res.data);
      setMessage('Account information updated.');
    } else {
      setMessage(res.message);
    }

    setSavingAccount(false);
  }

  function persistPaymentMethods(next: PaymentMethod[]) {
    setPaymentMethods(next);
    localStorage.setItem(paymentStorageKey, JSON.stringify(next));
  }

  function handleSavePayment(e: React.FormEvent) {
    e.preventDefault();
    setSavingPayment(true);

    const draft: PaymentDraft = {
      label: paymentDraft.label.trim(),
      cardholder: paymentDraft.cardholder.trim(),
      brand: paymentDraft.brand.trim(),
      last4: paymentDraft.last4.replace(/\D/g, '').slice(0, 4),
      expMonth: paymentDraft.expMonth.replace(/\D/g, '').slice(0, 2),
      expYear: paymentDraft.expYear.replace(/\D/g, '').slice(0, 4),
      is_default: paymentDraft.is_default,
    };

    const nextId = editingPaymentId ?? Date.now();

    const nextMethods = editingPaymentId
      ? paymentMethods.map((m) => (m.id === editingPaymentId ? { ...m, ...draft } : m))
      : [...paymentMethods, { id: nextId, ...draft }];

    // Normalize default selection
    let normalized = nextMethods;
    if (draft.is_default) {
      normalized = nextMethods.map((m) => ({ ...m, is_default: m.id === nextId }));
    } else {
      const hasDefault = nextMethods.some((m) => m.is_default);
      if (!hasDefault && nextMethods.length > 0) {
        normalized = nextMethods.map((m, idx) => ({ ...m, is_default: idx === 0 }));
      }
    }

    persistPaymentMethods(normalized);
    setPaymentDraft(emptyPayment);
    setEditingPaymentId(null);
    setSavingPayment(false);
    setMessage(editingPaymentId ? 'Payment method updated.' : 'Payment method saved.');
  }

  function startEditPayment(method: PaymentMethod) {
    setEditingPaymentId(method.id);
    setPaymentDraft({
      label: method.label,
      cardholder: method.cardholder,
      brand: method.brand,
      last4: method.last4,
      expMonth: method.expMonth,
      expYear: method.expYear,
      is_default: method.is_default,
    });
  }

  function handleDeletePayment(id: number) {
    const remaining = paymentMethods.filter((m) => m.id !== id);
    const hadDefaultRemoved = paymentMethods.some((m) => m.id === id && m.is_default);
    const normalized =
      hadDefaultRemoved && remaining.length > 0
        ? remaining.map((m, idx) => ({ ...m, is_default: idx === 0 }))
        : remaining;

    persistPaymentMethods(normalized);
    if (editingPaymentId === id) {
      setEditingPaymentId(null);
      setPaymentDraft(emptyPayment);
    }
    setMessage('Payment method deleted.');
  }

  function makeDefaultPayment(id: number) {
    const next = paymentMethods.map((m) => ({ ...m, is_default: m.id === id }));
    persistPaymentMethods(next);
    setMessage('Default payment method updated.');
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (passwordDraft.new_password !== passwordDraft.confirm_password) {
      setMessage('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    const res = await apiClient.changePassword({
      current_password: passwordDraft.current_password,
      new_password: passwordDraft.new_password,
    });

    if (res.success) {
      setPasswordDraft({ current_password: '', new_password: '', confirm_password: '' });
      setMessage('Password updated successfully.');
    } else {
      setMessage(res.message);
    }
    setSavingPassword(false);
  }

  async function reloadAddresses() {
    const res = await apiClient.getAddresses();
    if (res.success) setAddresses(res.data);
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    setSavingAddress(true);
    setMessage(null);

    const payload = {
      label: addressDraft.label || null,
      street_line1: addressDraft.street_line1,
      street_line2: addressDraft.street_line2 || null,
      city: addressDraft.city,
      state: addressDraft.state,
      zip: addressDraft.zip,
      country: addressDraft.country,
      is_default: addressDraft.is_default,
    };

    const res = editingAddressId
      ? await apiClient.updateAddress(editingAddressId, payload)
      : await apiClient.createAddress(payload);

    if (res.success) {
      setAddressDraft(emptyAddress);
      setEditingAddressId(null);
      await reloadAddresses();
      setMessage(editingAddressId ? 'Address updated.' : 'Address added.');
    } else {
      setMessage(res.message);
    }

    setSavingAddress(false);
  }

  function startEditAddress(address: Address) {
    setEditingAddressId(address.id);
    setAddressDraft({
      label: address.label ?? '',
      street_line1: address.street_line1,
      street_line2: address.street_line2 ?? '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      is_default: address.is_default,
    });
  }

  async function handleDeleteAddress(id: number) {
    const res = await apiClient.deleteAddress(id);
    if (res.success) {
      await reloadAddresses();
      setMessage('Address deleted.');
    } else {
      setMessage(res.message);
    }
  }

  async function handleReorder(orderId: number) {
    setReorderingOrderId(orderId);
    setMessage(null);

    const orderRes = await apiClient.getOrder(orderId);
    if (!orderRes.success) {
      setMessage(orderRes.message);
      setReorderingOrderId(null);
      return;
    }

    const order = orderRes.data as OrderWithItems;

    await clearCart();
    for (const item of order.items) {
      await addItem(item.product_id, item.quantity);
    }

    setMessage('Items from that order were added to your cart.');
    setReorderingOrderId(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account, addresses, payment details, and reorders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={ordersRoute} className="text-sm text-green-700 hover:underline">
            View Orders
          </Link>
          <Link to={cartRoute} className="text-sm text-green-700 hover:underline">
            Go to Cart
          </Link>
        </div>
      </div>

      {message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {message}
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
        <form onSubmit={handleSaveAccount} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="text-gray-600">Email</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={accountDraft.email}
              onChange={(e) => setAccountDraft((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Phone</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={accountDraft.phone}
              onChange={(e) => setAccountDraft((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">First Name</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={accountDraft.first_name}
              onChange={(e) => setAccountDraft((prev) => ({ ...prev, first_name: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Last Name</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={accountDraft.last_name}
              onChange={(e) => setAccountDraft((prev) => ({ ...prev, last_name: e.target.value }))}
            />
          </label>

          {isBusiness && (
            <>
              <label className="text-sm">
                <span className="text-gray-600">Company Name</span>
                <input
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  value={accountDraft.company_name}
                  onChange={(e) =>
                    setAccountDraft((prev) => ({ ...prev, company_name: e.target.value }))
                  }
                />
              </label>
              <label className="text-sm">
                <span className="text-gray-600">Tax ID</span>
                <input
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  value={accountDraft.tax_id}
                  onChange={(e) => setAccountDraft((prev) => ({ ...prev, tax_id: e.target.value }))}
                />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="text-gray-600">Billing Email</span>
                <input
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  value={accountDraft.billing_email}
                  onChange={(e) =>
                    setAccountDraft((prev) => ({ ...prev, billing_email: e.target.value }))
                  }
                />
              </label>
            </>
          )}

          <div className="md:col-span-2">
            <Button type="submit" isLoading={savingAccount} disabled={!canSaveAccount}>
              Save Account Changes
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm md:col-span-2">
            <span className="text-gray-600">Current Password</span>
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={passwordDraft.current_password}
              onChange={(e) =>
                setPasswordDraft((prev) => ({ ...prev, current_password: e.target.value }))
              }
              required
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">New Password</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={passwordDraft.new_password}
              onChange={(e) =>
                setPasswordDraft((prev) => ({ ...prev, new_password: e.target.value }))
              }
              required
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Confirm New Password</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={passwordDraft.confirm_password}
              onChange={(e) =>
                setPasswordDraft((prev) => ({ ...prev, confirm_password: e.target.value }))
              }
              required
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit" isLoading={savingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
        <p className="text-xs text-gray-500 mb-4">
          Saved locally in this browser for development preview only.
        </p>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="info">{paymentMethods.length} saved</Badge>
        </div>

        <form
          onSubmit={handleSavePayment}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-6"
        >
          <label className="text-sm md:col-span-2">
            <span className="text-gray-600">Label</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Primary card, Company card, etc."
              value={paymentDraft.label}
              onChange={(e) => setPaymentDraft((prev) => ({ ...prev, label: e.target.value }))}
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="text-gray-600">Cardholder Name</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={paymentDraft.cardholder}
              onChange={(e) => setPaymentDraft((prev) => ({ ...prev, cardholder: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Card Brand</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Visa / Mastercard"
              value={paymentDraft.brand}
              onChange={(e) => setPaymentDraft((prev) => ({ ...prev, brand: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Last 4 Digits</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              maxLength={4}
              value={paymentDraft.last4}
              onChange={(e) =>
                setPaymentDraft((prev) => ({ ...prev, last4: e.target.value.replace(/\D/g, '') }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Exp Month</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="MM"
              value={paymentDraft.expMonth}
              onChange={(e) =>
                setPaymentDraft((prev) => ({
                  ...prev,
                  expMonth: e.target.value.replace(/\D/g, ''),
                }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Exp Year</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="YYYY"
              value={paymentDraft.expYear}
              onChange={(e) =>
                setPaymentDraft((prev) => ({ ...prev, expYear: e.target.value.replace(/\D/g, '') }))
              }
            />
          </label>
          <label className="text-sm flex items-end gap-2">
            <input
              type="checkbox"
              checked={paymentDraft.is_default}
              onChange={(e) =>
                setPaymentDraft((prev) => ({ ...prev, is_default: e.target.checked }))
              }
            />
            <span className="text-gray-600">Set as default</span>
          </label>
          <div className="md:col-span-2">
            <Button type="submit" isLoading={savingPayment}>
              {editingPaymentId ? 'Update Payment Method' : 'Save Payment Method'}
            </Button>
            {editingPaymentId && (
              <button
                type="button"
                className="ml-3 text-sm text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setEditingPaymentId(null);
                  setPaymentDraft(emptyPayment);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {paymentMethods.length === 0 ? (
            <p className="text-sm text-gray-500">No saved payment methods yet.</p>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="rounded-md border border-gray-200 p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{method.label || 'Card'}</p>
                    {method.is_default && <Badge variant="success">Default</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">
                    {method.brand ? `${method.brand} · ` : ''}•••• {method.last4 || '____'}
                  </p>
                  {(method.expMonth || method.expYear) && (
                    <p className="text-sm text-gray-600">
                      Expires {method.expMonth || 'MM'}/{method.expYear || 'YYYY'}
                    </p>
                  )}
                  {method.cardholder && (
                    <p className="text-sm text-gray-600">{method.cardholder}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {!method.is_default && (
                    <button
                      type="button"
                      className="text-sm text-green-700 hover:underline"
                      onClick={() => makeDefaultPayment(method.id)}
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => startEditPayment(method)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => handleDeletePayment(method.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Delivery Addresses</h2>
          <Badge variant="info">{addresses.length} saved</Badge>
        </div>

        <form
          onSubmit={handleSaveAddress}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-6"
        >
          <p className="md:col-span-2 text-xs text-gray-500">
            Label helps you identify addresses later (for example: Home, Office, Warehouse).
          </p>
          <label className="text-sm">
            <span className="text-gray-600">Label</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Home, Office, etc."
              autoComplete="address-level4"
              value={addressDraft.label}
              onChange={(e) => setAddressDraft((prev) => ({ ...prev, label: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Street Line 1</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              autoComplete="address-line1"
              required
              value={addressDraft.street_line1}
              onChange={(e) =>
                setAddressDraft((prev) => ({ ...prev, street_line1: e.target.value }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Street Line 2</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              autoComplete="address-line2"
              value={addressDraft.street_line2}
              onChange={(e) =>
                setAddressDraft((prev) => ({ ...prev, street_line2: e.target.value }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">City</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              autoComplete="address-level2"
              required
              value={addressDraft.city}
              onChange={(e) => setAddressDraft((prev) => ({ ...prev, city: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">State</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              autoComplete="address-level1"
              required
              value={addressDraft.state}
              onChange={(e) => setAddressDraft((prev) => ({ ...prev, state: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">ZIP</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              autoComplete="postal-code"
              required
              value={addressDraft.zip}
              onChange={(e) => setAddressDraft((prev) => ({ ...prev, zip: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-600">Country</span>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              autoComplete="country-name"
              value={addressDraft.country}
              onChange={(e) => setAddressDraft((prev) => ({ ...prev, country: e.target.value }))}
            />
          </label>
          <label className="text-sm flex items-end gap-2">
            <input
              type="checkbox"
              checked={addressDraft.is_default}
              onChange={(e) =>
                setAddressDraft((prev) => ({ ...prev, is_default: e.target.checked }))
              }
            />
            <span className="text-gray-600">Set as default</span>
          </label>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" isLoading={savingAddress}>
              {editingAddressId ? 'Update Address' : 'Add Address'}
            </Button>
            {editingAddressId && (
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressDraft(emptyAddress);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {addresses.length === 0 ? (
            <p className="text-sm text-gray-500">No saved addresses yet.</p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-md border border-gray-200 p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{address.label || 'Address'}</p>
                    {address.is_default && <Badge variant="success">Default</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{address.street_line1}</p>
                  {address.street_line2 && (
                    <p className="text-sm text-gray-600">{address.street_line2}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => startEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
          <Link to={ordersRoute} className="text-sm text-green-700 hover:underline">
            Open full orders page
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-md border border-gray-200 p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {order.order_number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()} · {order.status}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  isLoading={reorderingOrderId === order.id}
                  onClick={() => handleReorder(order.id)}
                >
                  Reorder
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Reorder will clear your current cart and add all items from the selected order.
        </div>
      </section>

      <div className="text-xs text-gray-400">Profile path: {profileRoute}</div>
    </div>
  );
}
