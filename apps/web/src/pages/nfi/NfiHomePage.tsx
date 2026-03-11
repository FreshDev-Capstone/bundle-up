import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function NfiHomePage() {
  const { user, businessAccount } = useAuthStore();
  const isBusiness = user?.role === 'business';

  const featureCards = [
    {
      icon: '📦',
      title: 'Case Pricing',
      desc: 'Wholesale rates per case across all egg varieties',
      to: '/nfi/products',
    },
    {
      icon: '🚚',
      title: 'Bulk Ordering',
      desc: 'Order by the case with volume discounts',
      to: '/nfi/cart',
    },
    {
      icon: '📋',
      title: 'Invoice Details',
      desc: 'Full invoice documentation for every order',
      to: '/nfi/orders',
    },
  ].filter((feat) => (isBusiness ? true : feat.to !== '/nfi/orders'));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <div className="text-6xl mb-4">🏭</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bundle Up for Business</h1>
        <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
          Wholesale egg sourcing for food service, restaurants, and retailers. Case pricing,
          flexible ordering, and dedicated support.
        </p>
        {user && businessAccount && (
          <p className="text-blue-600 font-medium mb-6">Welcome, {businessAccount.company_name}</p>
        )}
        <div className="flex justify-center gap-4">
          <Link
            to="/nfi/products"
            className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Browse Catalog (Case Pricing)
          </Link>
          {!user && (
            <Link
              to="/nfi/register"
              className="rounded-md border border-blue-600 px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
            >
              Apply for Business Account
            </Link>
          )}
        </div>
      </div>

      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureCards.map((feat) => (
          <Link
            key={feat.title}
            to={feat.to}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{feat.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{feat.title}</h3>
            <p className="text-sm text-gray-500">{feat.desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Commodity', slug: 'commodity', emoji: '🐔' },
            { label: 'Organic', slug: 'organic', emoji: '🌿' },
            { label: 'Cage Free', slug: 'cage-free', emoji: '🏡' },
            { label: 'Pasture Raised', slug: 'pasture-raised', emoji: '🌾' },
            { label: 'Heirloom', slug: 'heirloom', emoji: '🌈' },
            { label: 'Specialty', slug: 'specialty', emoji: '⭐' },
            { label: 'Milk', slug: 'milk', emoji: '🥛' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={`/nfi/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="font-medium text-gray-800">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
