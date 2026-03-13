import React, { useMemo, useState } from 'react';
import { Button, Input } from '@bundle-up/ui';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useAuthModalStore } from '../../stores/authModalStore';
import { consumePendingAddToCart } from '../../lib/pendingCartAction';

export function AuthModalHost() {
  const { isOpen, variant, mode, close, setMode } = useAuthModalStore();
  const { login, registerCustomer, registerBusiness, isLoading, error, clearError } =
    useAuthStore();

  const logoSrc = variant === 'nfi' ? '/assets/logo/NFI.png' : '/assets/logo/SFI.png';

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [customerRegisterForm, setCustomerRegisterForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  const [businessRegisterForm, setBusinessRegisterForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    tax_id: '',
    billing_email: '',
  });

  const title = useMemo(() => {
    if (variant === 'nfi') {
      return mode === 'login' ? 'Business Sign In' : 'Apply for a Business Account';
    }
    return mode === 'login' ? 'Sign In' : 'Create an Account';
  }, [mode, variant]);

  async function applyPendingCartAction() {
    const pending = consumePendingAddToCart();
    if (!pending) return;
    await useCartStore.getState().addItem(pending.productId, pending.quantity);
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(loginForm.email, loginForm.password);

    const user = useAuthStore.getState().user;
    if (!user) return;

    await applyPendingCartAction();
    close();
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (variant === 'nfi') {
      await registerBusiness({
        ...businessRegisterForm,
        phone: businessRegisterForm.phone || undefined,
        tax_id: businessRegisterForm.tax_id || undefined,
        billing_email: businessRegisterForm.billing_email || undefined,
      });
    } else {
      await registerCustomer({
        ...customerRegisterForm,
        phone: customerRegisterForm.phone || undefined,
      });
    }

    const user = useAuthStore.getState().user;
    if (!user) return;

    await applyPendingCartAction();
    close();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onMouseDown={() => {
        clearError();
        close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative z-50 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative mb-4">
          <div className="text-center">
            <img
              src={logoSrc}
              alt={variant === 'nfi' ? 'Bundle Up business logo' : 'Bundle Up logo'}
              className="mx-auto h-16 w-16 object-contain"
            />
            <h2 className="text-xl font-semibold text-gray-900 mt-2">{title}</h2>
          </div>
          <button
            type="button"
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
            onClick={() => {
              clearError();
              close();
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
            <button onClick={clearError} className="ml-2 underline" type="button">
              Dismiss
            </button>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              id="auth_modal_email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              label="Password"
              type="password"
              id="auth_modal_password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <Button type="submit" isLoading={isLoading} size="lg" className="mt-1">
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-500">
              Need an account?{' '}
              <button
                type="button"
                className={
                  variant === 'nfi'
                    ? 'text-blue-600 hover:underline'
                    : 'text-green-600 hover:underline'
                }
                onClick={() => setMode('register')}
              >
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            {variant === 'nfi' ? (
              <>
                <h3 className="font-semibold text-gray-700">Contact Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    id="auth_modal_first_name"
                    value={businessRegisterForm.first_name}
                    onChange={(e) =>
                      setBusinessRegisterForm((prev) => ({ ...prev, first_name: e.target.value }))
                    }
                    required
                  />
                  <Input
                    label="Last Name"
                    id="auth_modal_last_name"
                    value={businessRegisterForm.last_name}
                    onChange={(e) =>
                      setBusinessRegisterForm((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  id="auth_modal_email"
                  value={businessRegisterForm.email}
                  onChange={(e) =>
                    setBusinessRegisterForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  id="auth_modal_password"
                  value={businessRegisterForm.password}
                  onChange={(e) =>
                    setBusinessRegisterForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  id="auth_modal_phone"
                  value={businessRegisterForm.phone}
                  onChange={(e) =>
                    setBusinessRegisterForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />

                <h3 className="font-semibold text-gray-700 mt-1">Business Information</h3>
                <Input
                  label="Company Name *"
                  id="auth_modal_company_name"
                  value={businessRegisterForm.company_name}
                  onChange={(e) =>
                    setBusinessRegisterForm((prev) => ({ ...prev, company_name: e.target.value }))
                  }
                  required
                />
                <Input
                  label="Tax ID (optional)"
                  id="auth_modal_tax_id"
                  value={businessRegisterForm.tax_id}
                  onChange={(e) =>
                    setBusinessRegisterForm((prev) => ({ ...prev, tax_id: e.target.value }))
                  }
                />
                <Input
                  label="Billing Email (optional)"
                  type="email"
                  id="auth_modal_billing_email"
                  value={businessRegisterForm.billing_email}
                  onChange={(e) =>
                    setBusinessRegisterForm((prev) => ({ ...prev, billing_email: e.target.value }))
                  }
                />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    id="auth_modal_first_name"
                    value={customerRegisterForm.first_name}
                    onChange={(e) =>
                      setCustomerRegisterForm((prev) => ({ ...prev, first_name: e.target.value }))
                    }
                    required
                  />
                  <Input
                    label="Last Name"
                    id="auth_modal_last_name"
                    value={customerRegisterForm.last_name}
                    onChange={(e) =>
                      setCustomerRegisterForm((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  id="auth_modal_email"
                  value={customerRegisterForm.email}
                  onChange={(e) =>
                    setCustomerRegisterForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  id="auth_modal_password"
                  value={customerRegisterForm.password}
                  onChange={(e) =>
                    setCustomerRegisterForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  id="auth_modal_phone"
                  value={customerRegisterForm.phone}
                  onChange={(e) =>
                    setCustomerRegisterForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </>
            )}

            <Button type="submit" isLoading={isLoading} size="lg" className="mt-1">
              {variant === 'nfi' ? 'Submit Application' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                className={
                  variant === 'nfi'
                    ? 'text-blue-600 hover:underline'
                    : 'text-green-600 hover:underline'
                }
                onClick={() => setMode('login')}
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
