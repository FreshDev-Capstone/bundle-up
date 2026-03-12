import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input, Button } from '@bundle-up/ui';
import { consumePendingAddToCart } from '../../lib/pendingCartAction';
import { useCartStore } from '../../stores/cartStore';

/**
 * NFI Login – B2B entry point.
 * NOTE: Login is NOT restricted to B2B users. A consumer or admin user who
 * lands here will be authenticated and routed based on their role.
 */
export function NfiLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
    const user = useAuthStore.getState().user;
    const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from;
    const fromPath = from?.pathname ? `${from.pathname}${from.search ?? ''}` : null;
    if (user) {
      const pending = consumePendingAddToCart();
      if (pending) {
        await useCartStore.getState().addItem(pending.productId, pending.quantity);
      }
      if (fromPath) {
        navigate(fromPath, { replace: true });
        return;
      }
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'business') navigate('/nfi');
      else navigate('/'); // consumer who signed in from NFI – route to SFI
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/assets/logo/NFI.png"
            alt="Bundle Up business logo"
            className="mx-auto h-20 w-20 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Business Sign In</h1>
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
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have a business account?{' '}
            <Link to="/nfi/register" className="text-blue-600 hover:underline">
              Apply here
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Retail customer?{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
