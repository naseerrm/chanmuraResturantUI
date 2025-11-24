import { Component } from '@angular/core';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-order',
  imports : [FormsModule], 
  templateUrl: './table-order.component.html',
  styleUrls: ['./table-order.component.scss']
})
export class TableOrderComponent {
  tableNumber = '';
  customerName = '';

  constructor(private cartService: CartService, private orderService: OrderService) {}

  placeTableOrder() {
 const cartItems: CartItem[] = this.cartService['cartItems'].getValue();

    if (!cartItems.length) { alert('Cart is empty'); return; }
    this.orderService.createOrder(cartItems, this.tableNumber, this.customerName);
    this.cartService.clearCart();
    alert('Table order placed!');
    this.tableNumber = '';
    this.customerName = '';
  }
}
