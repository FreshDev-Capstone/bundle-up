import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input, Button } from '@bundle-up/ui';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
    const user = useAuthStore.getState().user;
    if (user?.role === 'admin') navigate('/admin');
    else if (user) {
      useAuthStore.getState().logout();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🔐</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Admin Sign In</h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
              <button onClick={clearError} className="ml-2 underline">Dismiss</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Admin Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
