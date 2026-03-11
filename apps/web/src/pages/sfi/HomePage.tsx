import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="text-center">
        <div className="text-6xl mb-4">🥚</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fresh Eggs, Delivered.
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Sunshine Farms brings you the finest eggs – from everyday commodity white
          to premium pasture-raised and heirloom varieties. Shop retail or wholesale.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/products"
            className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white hover:bg-green-700"
          >
            Shop Now
          </Link>
          {user?.role === 'business' && (
            <Link
              to="/nfi"
              className="rounded-md border border-green-600 px-6 py-3 text-base font-medium text-green-600 hover:bg-green-50"
            >
              Business Orders (B2B)
            </Link>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-20">
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
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-green-300 hover:shadow-md transition-all"
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
