import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input, Button } from '@bundle-up/ui';
import { consumePendingAddToCart } from '../../lib/pendingCartAction';
import { useCartStore } from '../../stores/cartStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerCustomer, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await registerCustomer({
      ...form,
      phone: form.phone || undefined,
    });
    const user = useAuthStore.getState().user;
    if (user) {
      const pending = consumePendingAddToCart();
      if (pending) {
        await useCartStore.getState().addItem(pending.productId, pending.quantity);
      }
      navigate('/');
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/assets/logo/SFI.png"
            alt="Bundle Up logo"
            className="mx-auto h-20 w-20 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create an Account</h1>
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
            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Signing up as a business?{' '}
            <Link to="/nfi/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
