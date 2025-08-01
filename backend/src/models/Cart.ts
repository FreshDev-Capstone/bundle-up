import {
  Cart as CartType,
  CartItem as CartItemType,
} from "../../../shared/types";

export class CartModel implements CartType {
  id: string;
  items: CartItemType[] = [];
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  updatedAt: string;

  constructor() {
    this.id = `cart-${Date.now()}-${Math.random()}`;
    this.items = [];
    this.subtotal = 0;
    this.tax = 0;
    this.total = 0;
    this.updatedAt = new Date().toISOString();
  }

  addItem(item: CartItemType): void {
    this.items.push(item);
    this.calculateTotals();
  }

  removeItem(item: CartItemType): void {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.calculateTotals();
  }

  private calculateTotals(): void {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.tax = this.subtotal * 0.08; // 8% tax
    this.total = this.subtotal + this.tax;
    this.updatedAt = new Date().toISOString();
  }

  getItems(): CartItemType[] {
    return this.items;
  }

  getTotal(): number {
    return this.total;
  }
}

export default CartModel;
