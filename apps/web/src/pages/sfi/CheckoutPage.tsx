import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@bundle-up/ui';
import { useCartStore, useCartItemCount } from '../../stores/cartStore';
import { apiClient } from '../../lib/apiClient';
import type { Address } from '@bundle-up/shared-types';
import { formatPrice } from '@bundle-up/utils';

interface CheckoutPageProps {
  variant?: 'sfi' | 'nfi';
}

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

export function CheckoutPage({ variant = 'sfi' }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCartStore();
  const itemCount = useCartItemCount(cart);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartRoute = variant === 'nfi' ? '/nfi/cart' : '/cart';
  const productsRoute = variant === 'nfi' ? '/nfi/products' : '/products';
  const ordersDetailBase = variant === 'nfi' ? '/nfi/orders' : '/orders';

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      await fetchCart();
      const addressRes = await apiClient.getAddresses();
      if (!mounted) return;

      if (addressRes.success) {
        setAddresses(addressRes.data);
        const defaultAddress =
          addressRes.data.find((a) => a.is_default) ?? addressRes.data[0] ?? null;
        setSelectedAddressId(defaultAddress?.id ?? null);
      }
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [fetchCart]);

  const subtotal = useMemo(() => {
    return cart?.items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0) ?? 0;
  }, [cart]);

  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    setSavingAddress(true);
    setError(null);

    const res = await apiClient.createAddress({
      label: newAddress.label || null,
      street_line1: newAddress.street_line1,
      street_line2: newAddress.street_line2 || null,
      city: newAddress.city,
      state: newAddress.state,
      zip: newAddress.zip,
      country: newAddress.country,
      is_default: newAddress.is_default,
    });

    if (res.success) {
      const refreshed = await apiClient.getAddresses();
      if (refreshed.success) {
        setAddresses(refreshed.data);
      }
      setSelectedAddressId(res.data.id);
      setNewAddress(emptyAddress);
    } else {
      setError(res.message);
    }

    setSavingAddress(false);
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }

    setPlacingOrder(true);
    setError(null);

    try {
      const res = await apiClient.createOrder(selectedAddressId, selectedAddressId);
      if (res.success) {
        navigate(`${ordersDetailBase}/${res.data.id}?confirmed=1`);
        clearCart(); // fire-and-forget — cart was already cleared on the server
        return;
      }
      setError(res.message ?? 'Failed to place order. Please try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    }

    setPlacingOrder(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add products before checking out.</p>
        <Link
          to={productsRoute}
          className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-500">No saved address yet. Add one below.</p>
            ) : (
              <div className="space-y-2">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex items-start gap-3 rounded-md border border-gray-200 p-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1"
                    />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">{address.label || 'Address'}</p>
                      <p>{address.street_line1}</p>
                      {address.street_line2 && <p>{address.street_line2}</p>}
                      <p>
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h2>
            <p className="text-xs text-gray-500 mb-3">
              Label helps you identify addresses later (for example: Home, Work, Storefront).
            </p>
            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Label (Home, Work, etc.)"
                autoComplete="address-level4"
                value={newAddress.label}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, label: e.target.value }))}
              />
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Street Line 1"
                autoComplete="address-line1"
                required
                value={newAddress.street_line1}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, street_line1: e.target.value }))
                }
              />
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Street Line 2"
                autoComplete="address-line2"
                value={newAddress.street_line2}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, street_line2: e.target.value }))
                }
              />
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="City"
                autoComplete="address-level2"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
              />
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="State"
                autoComplete="address-level1"
                required
                value={newAddress.state}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, state: e.target.value }))}
              />
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="ZIP"
                autoComplete="postal-code"
                required
                value={newAddress.zip}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, zip: e.target.value }))}
              />
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Country"
                autoComplete="country-name"
                value={newAddress.country}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, country: e.target.value }))}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={newAddress.is_default}
                  onChange={(e) =>
                    setNewAddress((prev) => ({ ...prev, is_default: e.target.checked }))
                  }
                />
                Set as default
              </label>
              <div className="md:col-span-2">
                <Button type="submit" isLoading={savingAddress}>
                  Save Address
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment</h2>
            <p className="text-sm text-gray-500">
              Payment capture is mocked for this capstone. Placing the order will create it in your
              order history.
            </p>
          </div>
        </section>

        <aside className="rounded-lg border border-gray-200 bg-white p-5 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <span className="text-gray-700 line-clamp-1">
                  {item.quantity}x {(item as typeof item & { name?: string }).name}
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(Number(item.unit_price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Button onClick={handlePlaceOrder} isLoading={placingOrder}>
              Place Order
            </Button>
            <Link to={cartRoute} className="text-center text-sm text-gray-500 hover:text-gray-700">
              Back to cart
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
