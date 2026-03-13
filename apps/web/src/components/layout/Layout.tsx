import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AuthModalHost } from '../auth/AuthModalHost';
import { SupportChatWidget } from '../support/SupportChatWidget';
import { useAuthStore } from '../../stores/authStore';

interface LayoutProps {
  variant?: 'sfi' | 'nfi' | 'admin';
}

export function Layout({ variant = 'sfi' }: LayoutProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  const isSfi = variant === 'sfi';
  const isNfi = variant === 'nfi';

  if (isSfi && user?.role === 'business') {
    const targetPath =
      location.pathname === '/' ||
      location.pathname === '/login' ||
      location.pathname === '/register'
        ? '/nfi'
        : `/nfi${location.pathname}`;

    return <Navigate to={`${targetPath}${location.search}${location.hash}`} replace />;
  }

  if (isNfi && user && user.role !== 'business') {
    const nonBusinessHome = user.role === 'admin' ? '/admin' : '/';
    const pathAfterNfi = location.pathname.replace(/^\/nfi/, '') || '/';
    const targetPath =
      pathAfterNfi === '/login' || pathAfterNfi === '/register' ? nonBusinessHome : pathAfterNfi;

    return <Navigate to={`${targetPath}${location.search}${location.hash}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant={variant} />
      <AuthModalHost />
      {variant !== 'admin' && <SupportChatWidget variant={variant} />}
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Bundle Up. All rights reserved.
      </footer>
    </div>
  );
}
