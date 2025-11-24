import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../core/models/menu-item.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;

  constructor(private cartService: CartService, private orderService: OrderService) {}

 ngOnInit(): void {
    // Subscribe to cartItems$ observable
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartItems.reduce((sum, i) => sum + i.totalPrice, 0);
    });
  }

  remove(item: CartItem) {
    this.cartService.removeFromCart(item.menuItem.id);
  }

  placeOrder() {
    if (!this.cartItems.length) { alert('Cart is empty'); return; }
    this.orderService.createOrder(this.cartItems);
     this.checkout();
    this.cartService.clearCart();
  }

  increaseQuantity(item: MenuItem) {
    item.quantity = (item.quantity || 0) + 1;
    this.cartService.addToCart(item, 1); // Pass the MenuItem object
  }
  
  decreaseQuantity(item: MenuItem) {
    if ((item.quantity || 0) <= 0) return;
    item.quantity = item.quantity - 1;
    this.cartService.addToCart(item, -1); // Pass the MenuItem object
  }

   checkout() {
  if (this.cartItems.length === 0) return;

  // Generate order object
  const order = {
    id: Date.now(), // temporary unique ID
    items: this.cartItems,
    totalAmount: this.totalAmount,
    status: 'Pending' as 'Pending' | 'Preparing' | 'Served' | 'Completed',
    orderTime: new Date()
  };

  // Send order to backend or store locally
  console.log('Order:', order);

  // Clear cart
  this.cartService.clearCart();

  // Open invoice
  this.printInvoice(order);
}

printInvoice(order: any) {
  const invoiceWindow = window.open('', '_blank', 'width=600,height=800');
  invoiceWindow!.document.write(`
    <html>
    <head>
      <title>Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      </style>
    </head>
    <body>
      <h2>Naveen's Delhi Malai Chaap Resturant Invoice</h2>
      <p>Order ID: ${order.id}</p>
      <p>Order Time: ${order.orderTime}</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((i: CartItem) => `
            <tr>
              <td>${i.menuItem.name}</td>
              <td>${i.quantity}</td>
              <td>₹${i.menuItem.price}</td>
              <td>₹${i.totalPrice}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <h3>Total: ₹${order.totalAmount}</h3>
      <button onclick="window.print()">Print Invoice</button>
    </body>
    </html>
  `);
  invoiceWindow!.document.close();
}


}
