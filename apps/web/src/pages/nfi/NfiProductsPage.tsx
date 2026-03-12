import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product, PaginatedResponse } from '@bundle-up/shared-types';
import { Spinner } from '@bundle-up/ui';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useAuthModalStore } from '../../stores/authModalStore';
import { setPendingAddToCart } from '../../lib/pendingCartAction';

function getProductLabels(product: Product): string[] {
  const categoryName = (product as Product & { category_name?: string }).category_name;
  const candidates = [categoryName, product.farming_method].filter((value): value is string =>
    Boolean(value),
  );

  if (/\borganic\b/i.test(product.name) || /\borganic\b/i.test(product.slug)) {
    candidates.push('Organic');
  }

  const unique: string[] = [];
  for (const label of candidates) {
    if (!unique.some((existing) => existing.toLowerCase() === label.toLowerCase())) {
      unique.push(label);
    }
  }
  return unique;
}

function getVariantKey(product: Product): string {
  const normalizedName = product.name
    .replace(/\s*-\s*\d+\s*count$/i, '')
    .trim()
    .toLowerCase();
  return [
    normalizedName,
    product.product_color ?? '',
    product.product_size ?? '',
    product.category_id,
    product.farming_method ?? '',
  ].join('::');
}

export function NfiProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem, updateItem, removeItem, cart } = useCartStore();
  const { user } = useAuthStore();
  const { open: openAuthModal } = useAuthModalStore();

  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState<Record<number, number>>({});
  const [addingById, setAddingById] = useState<Record<number, boolean>>({});
  const [updatingById, setUpdatingById] = useState<Record<number, boolean>>({});

  const urlCategory = searchParams.get('category') ?? '';
  const urlSearch = searchParams.get('search') ?? '';
  const urlInStock = searchParams.get('in_stock') === '1';
  const urlSize = searchParams.get('size') ?? '';

  const [filters, setFilters] = useState({
    category: urlCategory,
    search: urlSearch,
    inStock: urlInStock,
    size: urlSize,
  });

  useEffect(() => {
    setFilters({ category: urlCategory, search: urlSearch, inStock: urlInStock, size: urlSize });
  }, [urlCategory, urlSearch, urlInStock, urlSize]);

  const categoryOptions = [
    { label: 'All', value: '' },
    { label: 'Commodity', value: 'commodity' },
    { label: 'Organic', value: 'organic' },
    { label: 'Cage Free', value: 'cage-free' },
    { label: 'Pasture Raised', value: 'pasture-raised' },
    { label: 'Heirloom', value: 'heirloom' },
    { label: 'Specialty', value: 'specialty' },
    { label: 'Milk', value: 'milk' },
  ];

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      params['per_page'] = '100';
      // Client-side filtering handles search/category/in-stock for seamless typing.

      const timeoutMs = 10000;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Request timed out. Please check API connectivity.')),
          timeoutMs,
        );
      });

      try {
        const res = await Promise.race([apiClient.getProducts(params), timeoutPromise]);
        if (!mounted) return;

        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to load products.');
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load products.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, [retryKey]);

  function matchesCategory(product: Product, categorySlug: string): boolean {
    if (!categorySlug) return true;
    const p = product as Product & { category_slug?: string };

    if (categorySlug === 'organic') {
      return (p.category_slug ?? '') === 'organic' || /\borganic\b/i.test(product.name);
    }

    if (categorySlug === 'cage-free') {
      return (p.category_slug ?? '') === 'cage-free' || product.farming_method === 'Cage Free';
    }

    if (categorySlug === 'pasture-raised') {
      return (
        (p.category_slug ?? '') === 'pasture-raised' || product.farming_method === 'Pasture Raised'
      );
    }

    return (p.category_slug ?? '') === categorySlug;
  }

  const filteredProducts = useMemo(() => {
    const products = data?.data ?? [];
    const term = filters.search.trim().toLowerCase();

    return products.filter((product) => {
      if (filters.inStock && !product.is_available) return false;
      if (!matchesCategory(product, filters.category)) return false;
      if (filters.size && (product.product_size ?? '') !== filters.size) return false;
      if (term && !product.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [data, filters.category, filters.inStock, filters.search, filters.size]);

  const sizeOptions = useMemo(() => {
    const values = new Set<string>();
    for (const product of data?.data ?? []) {
      if (product.product_size) values.add(product.product_size);
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const quickViewVariants = useMemo(() => {
    if (!quickViewProduct || !data) return [] as Product[];
    const key = getVariantKey(quickViewProduct);
    return data.data
      .filter((item) => getVariantKey(item) === key)
      .sort((a, b) => Number(a.product_count ?? 0) - Number(b.product_count ?? 0));
  }, [quickViewProduct, data]);

  function getCartItem(productId: number) {
    return cart?.items.find((item) => item.product_id === productId) ?? null;
  }

  function getModalQty(productId: number): number {
    return modalQty[productId] ?? 1;
  }

  function setModalQtyFor(productId: number, value: number) {
    const next = Math.max(1, Math.min(99, Number.isFinite(value) ? value : 1));
    setModalQty((prev) => ({ ...prev, [productId]: next }));
  }

  async function handleAddToCart(product: Product) {
    if (!user) {
      setPendingAddToCart({ productId: product.id, quantity: 1 });
      openAuthModal('nfi', 'login');
      return;
    }
    setAddingById((prev) => ({ ...prev, [product.id]: true }));
    await addItem(product.id, 1);
    setAddingById((prev) => ({ ...prev, [product.id]: false }));
  }

  async function handleModalAddToCart(product: Product) {
    if (!user) {
      setPendingAddToCart({ productId: product.id, quantity: getModalQty(product.id) });
      openAuthModal('nfi', 'login');
      return;
    }
    setAddingById((prev) => ({ ...prev, [product.id]: true }));
    await addItem(product.id, getModalQty(product.id));
    setAddingById((prev) => ({ ...prev, [product.id]: false }));
  }

  async function handleUpdateQty(product: Product, newQty: number) {
    const cartItem = getCartItem(product.id);
    if (!cartItem) return;
    setUpdatingById((prev) => ({ ...prev, [product.id]: true }));
    if (newQty <= 0) {
      await removeItem(cartItem.id);
    } else {
      await updateItem(cartItem.id, newQty);
    }
    setUpdatingById((prev) => ({ ...prev, [product.id]: false }));
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => setRetryKey((value) => value + 1)}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Wholesale Catalog</h1>
          <p className="text-blue-600 text-sm mt-1">
            Case pricing shown. All products available in full cases.
          </p>
        </div>

        <form
          className="mb-8 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const next = new URLSearchParams();
            const trimmedSearch = filters.search.trim();
            if (filters.category) next.set('category', filters.category);
            if (filters.size) next.set('size', filters.size);
            if (trimmedSearch) next.set('search', trimmedSearch);
            if (filters.inStock) next.set('in_stock', '1');
            setSearchParams(next);
          }}
        >
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              name="search"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search products"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="md:w-56">
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-40">
            <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
            <select
              name="size"
              value={filters.size}
              onChange={(e) => setFilters((prev) => ({ ...prev, size: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 md:pb-2">
            <input
              name="in_stock"
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setFilters((prev) => ({ ...prev, inStock: e.target.checked }))}
            />
            In stock only
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters({ category: '', search: '', inStock: false, size: '' });
                setSearchParams(new URLSearchParams());
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const labels = getProductLabels(product);
            const isAdding = addingById[product.id] ?? false;
            const isUpdating = updatingById[product.id] ?? false;
            const cartItem = getCartItem(product.id);
            return (
              <div
                key={product.id}
                className="group rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Clicking image + info opens quick view */}
                <button
                  type="button"
                  className="w-full text-left focus:outline-none"
                  onClick={() => setQuickViewProduct(product)}
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {product.primary_image ? (
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        🥚
                      </div>
                    )}
                  </div>
                  <div className="px-4 pt-4 pb-3">
                    <div className="mb-2 flex flex-wrap items-center gap-1">
                      {labels.length > 0 ? (
                        labels.map((label) => (
                          <span
                            key={`${product.id}-${label}`}
                            className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-700"
                          >
                            {label}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 uppercase">Eggs</span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                  </div>
                </button>

                {/* Cart controls — separate from modal trigger */}
                <div className="px-4 pb-4 pt-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(product.b2b_case_price)}
                      </p>
                      <p className="text-xs text-gray-400">per case</p>
                    </div>

                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(product, cartItem.quantity - 1)}
                          disabled={isUpdating}
                          className="h-7 w-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(product, cartItem.quantity + 1)}
                          disabled={isUpdating}
                          className="h-7 w-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdding || !product.is_available}
                        className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isAdding
                          ? 'Adding…'
                          : product.is_available
                            ? 'Add to Cart'
                            : 'Unavailable'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 className="text-lg font-semibold text-gray-900">Quick View</h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setQuickViewProduct(null)}
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
              <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden">
                {quickViewProduct.primary_image ? (
                  <img
                    src={quickViewProduct.primary_image}
                    alt={quickViewProduct.name}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-6xl">🥚</div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{quickViewProduct.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{quickViewProduct.description}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(quickViewProduct.b2b_case_price)}
                </p>
                <p className="text-xs text-gray-500 mb-4">per case</p>

                {quickViewVariants.length > 1 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Choose Count</p>
                    <div className="flex flex-wrap gap-2">
                      {quickViewVariants.map((variant) => {
                        const selected = variant.id === quickViewProduct.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setQuickViewProduct(variant)}
                            className={`rounded-md border px-3 py-1.5 text-sm ${
                              selected
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 text-gray-700 hover:border-blue-400'
                            }`}
                          >
                            {variant.product_count} count
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      setModalQtyFor(quickViewProduct.id, getModalQty(quickViewProduct.id) - 1)
                    }
                    className="h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    value={getModalQty(quickViewProduct.id)}
                    onChange={(e) => setModalQtyFor(quickViewProduct.id, Number(e.target.value))}
                    className="w-12 rounded border border-gray-300 px-2 py-1 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setModalQtyFor(quickViewProduct.id, getModalQty(quickViewProduct.id) + 1)
                    }
                    className="h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleModalAddToCart(quickViewProduct)}
                    disabled={addingById[quickViewProduct.id] || !quickViewProduct.is_available}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingById[quickViewProduct.id] ? 'Adding…' : 'Add to Cart'}
                  </button>
                  <Link
                    to={`/nfi/products/${quickViewProduct.slug}`}
                    className="text-sm font-medium text-blue-700 hover:underline"
                  >
                    Full details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
