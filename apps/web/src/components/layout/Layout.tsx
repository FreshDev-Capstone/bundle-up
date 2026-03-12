import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AuthModalHost } from '../auth/AuthModalHost';
import { SupportChatWidget } from '../support/SupportChatWidget';

interface LayoutProps {
  variant?: 'sfi' | 'nfi' | 'admin';
}

export function Layout({ variant = 'sfi' }: LayoutProps) {
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
