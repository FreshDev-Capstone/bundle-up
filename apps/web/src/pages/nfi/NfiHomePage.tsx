import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function NfiHomePage() {
  const { user, businessAccount } = useAuthStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <div className="text-6xl mb-4">🏭</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bundle Up for Business
        </h1>
        <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
          Wholesale egg sourcing for food service, restaurants, and retailers.
          Case pricing, flexible ordering, and dedicated support.
        </p>
        {user && businessAccount && (
          <p className="text-blue-600 font-medium mb-6">
            Welcome, {businessAccount.company_name}
          </p>
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
        {[
          { icon: '📦', title: 'Case Pricing', desc: 'Wholesale rates per case across all egg varieties' },
          { icon: '🚚', title: 'Bulk Ordering', desc: 'Order by the case with volume discounts' },
          { icon: '📋', title: 'Invoice Details', desc: 'Full invoice documentation for every order' },
        ].map((feat) => (
          <div key={feat.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-3xl mb-3">{feat.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{feat.title}</h3>
            <p className="text-sm text-gray-500">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
