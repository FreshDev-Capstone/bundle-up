// ─── Formatting ───────────────────────────────────────────────────────────────

/**
 * Format a price in USD cents as a dollar string (e.g. 399 → "$3.99")
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Format a dollar float as a display string (e.g. 3.99 → "$3.99")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// ─── Slugs ────────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Order Numbers ────────────────────────────────────────────────────────────

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BU-${timestamp}-${random}`;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export function getPaginationMeta(total: number, page: number, perPage: number) {
  return {
    total,
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
  };
}

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
