import { Product, CartItem as CartItemType } from "../../../shared/types";

export class CartItemModel implements CartItemType {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;

  constructor(product: Product, quantity: number) {
    this.id = `${Date.now()}-${Math.random()}`;
    this.productId = product.id.toString();
    this.quantity = quantity;
    this.price = product.b2cPrice;
    this.product = product;
  }

  getProduct(): Product | undefined {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }
}

export default CartItemModel;
