import { Injectable } from '@angular/core';
import { CartItem, CartService } from './cart.service';
import { Order, OrderItem, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private nextId = 1;

  constructor(private cartService : CartService) { } 

  createOrder(cartItems: CartItem[], tableNumber?: string, customerName?: string) {
    const items: OrderItem[] = cartItems.map(ci => ({
      menuItem: ci.menuItem,
      quantity: ci.quantity,
      totalPrice: ci.totalPrice
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);

    const order: Order = {
      id: this.nextId++,
      items,
      totalAmount,
      status: 'Pending',
      tableNumber,
      customerName,
      orderTime: new Date()
    };

    this.orders.push(order);
    this.cartService.updateCartCount();
    return order;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  updateStatus(orderId: number, status: OrderStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) order.status = status;
  }
}
