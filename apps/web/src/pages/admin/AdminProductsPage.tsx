import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product } from '@bundle-up/shared-types';
import { Spinner, Button } from '@bundle-up/ui';
import { useAuthStore } from '../../stores/authStore';

type AdminProductRow = Product & {
  category_name?: string;
  inventory_by_carton?: number;
  inventory_by_case?: number;
};

export function AdminProductsPage() {
  const { token, user } = useAuthStore();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<{
    sku?: string;
    name: string;
    category_slug?: string;
    description: string;
    primary_image?: string;
    b2c_unit_price: string;
    b2b_case_price: string;
    inventory_by_carton: string;
    inventory_by_case: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function uploadPrimaryImage(file: File) {
    setSaveError(null);
    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiClient.uploadProductImage(form);
      if (!res.success) {
        setSaveError(res.message ?? 'Failed to upload image');
        return;
      }
      setDraft((d) => (d ? { ...d, primary_image: res.data.url } : d));
    } finally {
      setUploadingImage(false);
    }
  }

  const categoryOptions = [
    { label: 'Commodity', value: 'commodity' },
    { label: 'Organic', value: 'organic' },
    { label: 'Cage Free', value: 'cage-free' },
    { label: 'Pasture Raised', value: 'pasture-raised' },
    { label: 'Heirloom', value: 'heirloom' },
    { label: 'Specialty', value: 'specialty' },
    { label: 'Milk', value: 'milk' },
  ];

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;

    setLoading(true);
    setLoadError(null);
    apiClient.getProductsAdmin().then((res) => {
      if (res.success) {
        setProducts(res.data);
      } else {
        setLoadError(res.message ?? 'Failed to load products');
      }
      setLoading(false);
    });
  }, [token, user?.role]);

  const editingProduct = useMemo(
    () => (editingId ? (products.find((p) => p.id === editingId) ?? null) : null),
    [editingId, products],
  );

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((p) => {
      const haystack = [p.sku, p.name, p.category_name].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [products, search]);

  function startEdit(product: AdminProductRow) {
    setSaveError(null);
    setIsCreating(false);
    setEditingId(product.id);
    setDraft({
      name: product.name,
      description: product.description ?? '',
      b2c_unit_price: String(product.b2c_unit_price ?? ''),
      b2b_case_price: String(product.b2b_case_price ?? ''),
      inventory_by_carton: String(product.inventory_by_carton ?? 0),
      inventory_by_case: String(product.inventory_by_case ?? 0),
    });
  }

  function startCreate() {
    setSaveError(null);
    setEditingId(null);
    setIsCreating(true);
    setDraft({
      sku: '',
      name: '',
      category_slug: categoryOptions[0]?.value ?? '',
      description: '',
      primary_image: '',
      b2c_unit_price: '',
      b2b_case_price: '',
      inventory_by_carton: '0',
      inventory_by_case: '0',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setDraft(null);
    setSaveError(null);
  }

  async function saveEdit() {
    if (!editingProduct || !draft) return;
    setSaving(true);
    setSaveError(null);

    const productRes = await apiClient.updateProductAdmin(editingProduct.id, {
      name: draft.name,
      description: draft.description.length ? draft.description : null,
      b2c_unit_price: Number(draft.b2c_unit_price),
      b2b_case_price: Number(draft.b2b_case_price),
    });

    if (!productRes.success) {
      setSaveError(productRes.message ?? 'Failed to save product changes');
      setSaving(false);
      return;
    }

    const inventoryRes = await apiClient.updateProductInventoryAdmin(editingProduct.id, {
      inventory_by_carton: Number(draft.inventory_by_carton),
      inventory_by_case: Number(draft.inventory_by_case),
    });

    if (!inventoryRes.success) {
      setSaveError(inventoryRes.message ?? 'Failed to save inventory changes');
      setSaving(false);
      return;
    }

    const nextRow = inventoryRes.data as unknown as AdminProductRow;
    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...nextRow } : p)));
    setSaving(false);
    cancelEdit();
  }

  async function createProduct() {
    if (!draft) return;
    setSaving(true);
    setSaveError(null);

    const sku = String(draft.sku ?? '').trim();
    const name = draft.name.trim();
    const category_slug = String(draft.category_slug ?? '').trim();
    const b2c = Number(draft.b2c_unit_price);
    const b2b = Number(draft.b2b_case_price);
    const invCarton = Number(draft.inventory_by_carton);
    const invCase = Number(draft.inventory_by_case);

    if (!sku || !name || !category_slug) {
      setSaveError('SKU, Name, and Category are required.');
      setSaving(false);
      return;
    }
    if (!Number.isFinite(b2c) || !Number.isFinite(b2b)) {
      setSaveError('Both prices are required.');
      setSaving(false);
      return;
    }

    const res = await apiClient.createProductAdmin({
      sku,
      name,
      category_slug,
      description: draft.description.trim().length ? draft.description.trim() : null,
      primary_image: String(draft.primary_image ?? '').trim().length
        ? String(draft.primary_image ?? '').trim()
        : null,
      b2c_unit_price: b2c,
      b2b_case_price: b2b,
      inventory_by_carton: Number.isFinite(invCarton) ? invCarton : 0,
      inventory_by_case: Number.isFinite(invCase) ? invCase : 0,
    });

    setSaving(false);

    if (!res.success) {
      setSaveError(res.message ?? 'Failed to create product');
      return;
    }

    const row = res.data as unknown as AdminProductRow;
    setProducts((prev) => [row, ...prev]);
    cancelEdit();
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (loadError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4">
          <Link to="/admin" className="text-sm font-medium text-purple-700 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        <p className="text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        <Link to="/admin" className="text-sm font-medium text-purple-700 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button size="sm" onClick={startCreate} disabled={saving}>
          Add Product
        </Button>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {((editingProduct && draft) || (isCreating && draft)) && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              {isCreating ? (
                <>
                  <p className="text-sm font-medium text-gray-900">New product</p>
                  <p className="text-xs text-gray-500">Will appear on B2C + B2B products pages</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900">
                    Editing: {editingProduct?.name}
                  </p>
                  <p className="text-xs text-gray-500">SKU: {editingProduct?.sku}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={cancelEdit} disabled={saving}>
                Cancel
              </Button>
              {isCreating ? (
                <Button size="sm" onClick={createProduct} isLoading={saving}>
                  Create
                </Button>
              ) : (
                <Button size="sm" onClick={saveEdit} isLoading={saving}>
                  Save
                </Button>
              )}
            </div>
          </div>

          {saveError && <p className="mt-3 text-sm text-red-600">{saveError}</p>}

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {isCreating && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={draft.sku ?? ''}
                    onChange={(e) => setDraft((d) => (d ? { ...d, sku: e.target.value } : d))}
                    placeholder="E.g. EGGS-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={draft.category_slug ?? ''}
                    onChange={(e) =>
                      setDraft((d) => (d ? { ...d, category_slug: e.target.value } : d))
                    }
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={draft.name}
                onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
              />
            </div>

            {isCreating && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Primary Image</label>

                <div
                  className="mt-1 rounded-md border border-dashed border-gray-300 bg-white px-3 py-4 text-sm text-gray-600"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) void uploadPrimaryImage(file);
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">Drag & drop an image here</p>
                      <p className="text-xs text-gray-500">PNG/JPG/WebP/GIF up to 5MB</p>
                    </div>

                    <label className="inline-flex">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void uploadPrimaryImage(file);
                          e.currentTarget.value = '';
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        isLoading={uploadingImage}
                      >
                        Choose file
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600">
                    Or paste image URL
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={draft.primary_image ?? ''}
                    onChange={(e) =>
                      setDraft((d) => (d ? { ...d, primary_image: e.target.value } : d))
                    }
                    placeholder="https://… or /api/uploads/..."
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  B2C Price (per carton)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={draft.b2c_unit_price}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, b2c_unit_price: e.target.value } : d))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Inventory (cartons)
                </label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={draft.inventory_by_carton}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, inventory_by_carton: e.target.value } : d))
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  Availability updates automatically based on inventory.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">B2B Case Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={draft.b2b_case_price}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, b2b_case_price: e.target.value } : d))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Inventory (cases)</label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={draft.inventory_by_case}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, inventory_by_case: e.target.value } : d))
                  }
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft((d) => (d ? { ...d, description: e.target.value } : d))}
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Inv (carton)</th>
              <th className="px-4 py-3 text-right">Inv (case)</th>
              <th className="px-4 py-3 text-right">B2C Price</th>
              <th className="px-4 py-3 text-right">B2B Case Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleProducts.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-500" colSpan={9}>
                  No products found.
                </td>
              </tr>
            )}
            {visibleProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category_name}</td>
                <td className="px-4 py-3 text-right text-gray-700">{p.inventory_by_carton ?? 0}</td>
                <td className="px-4 py-3 text-right text-gray-700">{p.inventory_by_case ?? 0}</td>
                <td className="px-4 py-3 text-right">{formatPrice(p.b2c_unit_price)}</td>
                <td className="px-4 py-3 text-right text-blue-600">
                  {formatPrice(p.b2b_case_price)}
                </td>
                <td className="px-4 py-3">
                  <Button variant={p.is_available ? 'secondary' : 'danger'} size="sm" disabled>
                    {p.is_available ? 'Available' : 'Unavailable'}
                  </Button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
