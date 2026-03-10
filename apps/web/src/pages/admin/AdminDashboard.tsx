import React from 'react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const stats = [
    { label: 'Products', emoji: '🥚', href: '/admin/products' },
    { label: 'Orders', emoji: '📦', href: '/admin/orders' },
    { label: 'Users', emoji: '👥', href: '/admin/users' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.href}
            className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-10 shadow-sm hover:border-purple-300 hover:shadow-md transition-all"
          >
            <span className="text-5xl">{s.emoji}</span>
            <span className="text-lg font-semibold text-gray-800">{s.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
