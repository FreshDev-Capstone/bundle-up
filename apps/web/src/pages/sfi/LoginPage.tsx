import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input, Button } from '@bundle-up/ui';
import { consumePendingAddToCart } from '../../lib/pendingCartAction';
import { useCartStore } from '../../stores/cartStore';

/**
 * SFI Login – B2C entry point.
 * NOTE: Login is NOT restricted to B2C users. A business or admin user who
 * lands here will be authenticated and routed based on their role.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
    // After login, route by role
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
      else navigate('/');
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/assets/logo/SFI.png"
            alt="Bundle Up logo"
            className="mx-auto h-20 w-20 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Sign in to Bundle Up</h1>
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
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-green-600 hover:underline">
              Create one
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Business customer?{' '}
            <Link to="/nfi/login" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
