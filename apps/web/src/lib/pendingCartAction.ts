export type PendingAddToCart = {
  productId: number;
  quantity: number;
  createdAt: number;
};

const STORAGE_KEY = 'bundle-up-pending-add-to-cart';

export function setPendingAddToCart(action: Omit<PendingAddToCart, 'createdAt'>): void {
  const payload: PendingAddToCart = { ...action, createdAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function peekPendingAddToCart(): PendingAddToCart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingAddToCart>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.productId !== 'number') return null;
    if (typeof parsed.quantity !== 'number') return null;
    if (typeof parsed.createdAt !== 'number') return null;
    return { productId: parsed.productId, quantity: parsed.quantity, createdAt: parsed.createdAt };
  } catch {
    return null;
  }
}

export function consumePendingAddToCart(): PendingAddToCart | null {
  const action = peekPendingAddToCart();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return action;
}

export function clearPendingAddToCart(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
