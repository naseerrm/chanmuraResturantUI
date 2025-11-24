import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  totalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addToCart(menuItem: MenuItem, quantity: number = 1) {
    const items = this.cartItems.value;
    const existing = items.find(i => i.menuItem.id === menuItem.id);

    if (existing) {
      existing.quantity += quantity;

      if (existing.quantity <= 0) {
        this.removeFromCart(menuItem.id);
        return;
      }

      existing.totalPrice = existing.menuItem.price * existing.quantity;
    } else if (quantity > 0) {
      items.push({ menuItem, quantity, totalPrice: menuItem.price * quantity });
    }

    // ✅ Only BehaviorSubject has .next()
    this.cartItems.next([...items]);
  }

  removeFromCart(menuItemId: number) {
    const items = this.cartItems.value.filter(i => i.menuItem.id !== menuItemId);
    this.cartItems.next([...items]);
  }

  clearCart() {
    this.cartItems.next([]);
  }

  getTotalAmount(): number {
    return this.cartItems.value.reduce((sum, i) => sum + i.totalPrice, 0);
  }
}
