import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input, Button } from '@bundle-up/ui';
import { consumePendingAddToCart } from '../../lib/pendingCartAction';
import { useCartStore } from '../../stores/cartStore';

export function NfiRegisterPage() {
  const navigate = useNavigate();
  const { registerBusiness, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    tax_id: '',
    billing_email: '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await registerBusiness({
      ...form,
      phone: form.phone || undefined,
      tax_id: form.tax_id || undefined,
      billing_email: form.billing_email || undefined,
    });
    const user = useAuthStore.getState().user;
    if (user) {
      const pending = consumePendingAddToCart();
      if (pending) {
        await useCartStore.getState().addItem(pending.productId, pending.quantity);
      }
      navigate('/nfi');
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <img
            src="/assets/logo/NFI.png"
            alt="Bundle Up business logo"
            className="mx-auto h-20 w-20 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Apply for a Business Account</h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
              <button onClick={clearError} className="ml-2 underline">
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-700">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                id="first_name"
                value={form.first_name}
                onChange={(e) => set('first_name', e.target.value)}
                required
              />
              <Input
                label="Last Name"
                id="last_name"
                value={form.last_name}
                onChange={(e) => set('last_name', e.target.value)}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              required
            />
            <Input
              label="Phone (optional)"
              type="tel"
              id="phone"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />

            <h3 className="font-semibold text-gray-700 mt-2">Business Information</h3>
            <Input
              label="Company Name *"
              id="company_name"
              value={form.company_name}
              onChange={(e) => set('company_name', e.target.value)}
              required
            />
            <Input
              label="Tax ID (optional)"
              id="tax_id"
              value={form.tax_id}
              onChange={(e) => set('tax_id', e.target.value)}
            />
            <Input
              label="Billing Email (optional)"
              type="email"
              id="billing_email"
              value={form.billing_email}
              onChange={(e) => set('billing_email', e.target.value)}
            />

            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
              Submit Application
            </Button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Business accounts are reviewed before wholesale pricing is activated.
          </p>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/nfi/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
