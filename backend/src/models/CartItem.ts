import {Product, CartItem} from '../../shared/types';

class CartItem: CartItem {
    constructor(product: Product, quantity: number) {
        this.product = product;
        this.quantity = quantity;
    }

    getProduct(): Product {
        return this.product;
    }

    getQuantity(): number {
        return this.quantity;
    }
}

export default CartItem;