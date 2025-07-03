import {Cart} from '../../shared/types';

class Cart: Cart {
  private items: CartItem[] = [];
  private total: number = 0;

  constructor() {
    this.items = [];
    this.total = 0;
  }

  addItem(item: CartItem): void {
    this.items.push(item);
    this.total += item.getProduct().price * item.getQuantity();
  }

  removeItem(item: CartItem): void {
    this.items = this.items.filter(i => i !== item);
    this.total -= item.getProduct().price * item.getQuantity();
  }
  
}

export default Cart;