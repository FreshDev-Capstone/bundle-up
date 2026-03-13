import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function EggLabelsInfoPage() {
  const location = useLocation();
  const isBusiness = location.pathname.startsWith('/nfi');

  const productsHref = isBusiness ? '/nfi/products' : '/products';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Egg Labels, Explained</h1>
        <p className="mt-2 text-gray-600">
          These labels can overlap. This page is a quick guide to what they typically mean when you
          see them on packaging.
        </p>
        <p className="mt-2 text-gray-600">
          In Bundle Up, the small badges you see on product cards come from the product’s category
          (like “Heirloom” or “Milk”) and/or its farming method (like “Cage Free”).
        </p>
        <div className="mt-4">
          <Link to={productsHref} className="text-sm font-medium text-green-700 hover:underline">
            Browse products
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">A Common Progression</h2>
          <p className="mt-2 text-gray-600">
            People often think about labels in a rough progression like this (from more general to
            more specific claims). Exact standards vary by certifier and farm.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Commodity</h2>
          <p className="mt-2 text-gray-600">
            Commodity is a broad category for standard eggs that aren’t marketed under specialty
            production claims.
          </p>
          <ul className="mt-3 list-disc pl-5 text-gray-600">
            <li>Often the “default” category.</li>
            <li>Other labels (like cage-free) can still appear separately.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Cage-Free</h2>
          <p className="mt-2 text-gray-600">
            Cage-free generally means hens aren’t kept in cages. They’re usually housed in indoor
            barns or aviary systems.
          </p>
          <ul className="mt-3 list-disc pl-5 text-gray-600">
            <li>Typically indoor housing (not guaranteed outdoor access).</li>
            <li>Space and conditions can vary by farm and certification.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Free-Range</h2>
          <p className="mt-2 text-gray-600">
            Free-range generally means hens have some outdoor access, but the amount of time/space
            can vary a lot.
          </p>
          <ul className="mt-3 list-disc pl-5 text-gray-600">
            <li>Usually implies some outdoor access.</li>
            <li>Standards vary; check the specific certification when available.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Organic</h2>
          <p className="mt-2 text-gray-600">
            Organic refers to how the hens are raised and what they’re fed. It usually means organic
            feed and restrictions on certain medications and inputs.
          </p>
          <ul className="mt-3 list-disc pl-5 text-gray-600">
            <li>Focuses on feed and farm inputs.</li>
            <li>Doesn’t automatically mean “pasture-raised”.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Pasture-Raised</h2>
          <p className="mt-2 text-gray-600">
            Pasture-raised generally means hens have outdoor access to pasture areas for a
            meaningful portion of their lives.
          </p>
          <ul className="mt-3 list-disc pl-5 text-gray-600">
            <li>Outdoor access is the main idea (details vary by certifier/farm).</li>
            <li>Not the same as “free-range” (which can be broader and vary widely).</li>
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Heirloom</h2>
          <p className="mt-2 text-gray-600">
            Heirloom typically refers to heritage breeds or distinctive varieties. It’s more about
            the type/variety than a single farming standard.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Specialty</h2>
          <p className="mt-2 text-gray-600">
            Specialty is a catch-all category for products that have unique attributes beyond
            standard commodity eggs (for example, unique varieties or features).
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Milk</h2>
          <p className="mt-2 text-gray-600">
            Milk is a product category in the catalog (not an egg production label).
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Comparison</h2>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">Main Focus</th>
                  <th className="px-4 py-3">Not Guaranteed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Commodity</td>
                  <td className="px-4 py-3 text-gray-600">Standard category</td>
                  <td className="px-4 py-3 text-gray-600">Any specific welfare/feed claims</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Cage-Free</td>
                  <td className="px-4 py-3 text-gray-600">No cages (housing system)</td>
                  <td className="px-4 py-3 text-gray-600">Outdoor pasture access</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Free-Range</td>
                  <td className="px-4 py-3 text-gray-600">Some outdoor access</td>
                  <td className="px-4 py-3 text-gray-600">Specific pasture space/time standards</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Organic</td>
                  <td className="px-4 py-3 text-gray-600">Feed + farm inputs</td>
                  <td className="px-4 py-3 text-gray-600">Pasture-raised conditions</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Pasture-Raised</td>
                  <td className="px-4 py-3 text-gray-600">Outdoor access</td>
                  <td className="px-4 py-3 text-gray-600">Organic feed</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Heirloom</td>
                  <td className="px-4 py-3 text-gray-600">Variety/breed style</td>
                  <td className="px-4 py-3 text-gray-600">Organic or pasture-raised</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Specialty</td>
                  <td className="px-4 py-3 text-gray-600">Unique catalog category</td>
                  <td className="px-4 py-3 text-gray-600">Any single standardized claim</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Milk</td>
                  <td className="px-4 py-3 text-gray-600">Product category</td>
                  <td className="px-4 py-3 text-gray-600">Egg production attributes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Tip: Certifications and farm practices matter. When in doubt, check the specific
            certification on the carton.
          </p>
        </section>
      </div>
    </div>
  );
}
