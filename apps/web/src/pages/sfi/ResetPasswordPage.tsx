import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { Button, Card, CardBody, CardHeader } from '@bundle-up/ui';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get('token') ?? '';

  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Missing reset token. Please use the link provided in your email.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    const res = await apiClient.resetPassword({ token, new_password: newPassword });
    setSaving(false);

    if (!res.success) {
      setError(res.message ?? 'Failed to reset password');
      return;
    }

    setSuccess('Password reset successfully. Redirecting to sign in…');
    setTimeout(() => navigate('/login'), 800);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-10">
      <div className="mb-6">
        <Link to="/login" className="text-sm font-medium text-purple-700 hover:underline">
          ← Back to Sign In
        </Link>
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-700">{success}</p>}

            <Button type="submit" isLoading={saving} className="w-full">
              Reset Password
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
