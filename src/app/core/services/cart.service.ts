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
    private cartCount = new BehaviorSubject<number>(0);

    cartItems$ = this.cartItems.asObservable();
    cartCount$ = this.cartCount.asObservable();

 addToCart(menuItem: MenuItem, quantity: number = 1) {
  const items = this.cartItems.value;
  const existing = items.find(i => i.menuItem.id === menuItem.id);

  // If item already exists in cart
  if (existing) {
    existing.quantity += quantity;

    // If quantity becomes zero or negative → remove item
    if (existing.quantity <= 0) {
      this.removeFromCart(menuItem.id!);
      return;
    }

    // Recalculate total
    existing.totalPrice = existing.quantity * existing.menuItem.price;
  }
  else if (quantity > 0) {
    // If item is new → add to cart
    items.push({
      menuItem,
      quantity,
      totalPrice: menuItem.price * quantity
    });

    //   // 🔥 Update cart count
    // const total = items.reduce((sum, x) => sum + (x.quantity || 0), 0);
    // this.cartCount.next(total); // Broadcast to header
    this.updateCartCount();
  }


  // Update BehaviorSubject
  this.cartItems.next([...items]);
}


  updateCartCount() {
    const items = this.cartItems.value;
    const total = items.reduce((sum, x) => sum + (x.quantity || 0), 0);
    this.cartCount.next(total); // Broadcast to header
  }


  removeFromCart(menuItemId: string) {
    const items = this.cartItems.value.filter(i => i.menuItem.id !== menuItemId);
    this.updateCartCount();
    this.cartItems.next([...items]);
  }

  clearCart() {
    this.cartItems.next([]);
    this.updateCartCount();
  }

  getTotalAmount(): number {
    return this.cartItems.value.reduce((sum, i) => sum + i.totalPrice, 0);
  }
}
