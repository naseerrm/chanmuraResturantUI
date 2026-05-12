import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CartService, CartItem } from '../../core/services/cart.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { RestaurantContextService } from '../../features/restaurant-context.service';
import { BillSummaryComponent } from '../../shared/components/bill-summary/bill-summary';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule,BillSummaryComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  companyId: string = '';
  cartItems: CartItem[] = [];
  purchaserName: string = '';
  mobileNumber: string = '';
  paymentMethod : string = '';

  totalAmount: number = 0;
   // Billing
  cartTotal = 0;

  // UPI QR
  upiQrCode: string = '';

  @ViewChild(BillSummaryComponent) billSummary!: BillSummaryComponent;

  constructor(
    private cartService: CartService,
    private firebaseService: FirebaseService,
    private router: Router,
    private restaurantContext : RestaurantContextService
  ) {}

  ngOnInit(): void {
this.restaurantContext.userDetail$.subscribe(async (user) => {
      if (!user) return;

      this.companyId = user.companyId;
})

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartItems.reduce((sum, i) => sum + i.totalPrice, 0);
      this.updateCartTotal();
    });
  }

  handleOrderConfirmed(event: any) {
  console.log('Order confirmed:', event);
  // You can save order or print bill here
}

  increaseQuantity(item: CartItem) {
    this.cartService.addToCart(item.menuItem, 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.addToCart(item.menuItem, -1);
    } else {
      this.remove(item);
    }
  }

  remove(item: CartItem) {
    this.cartService.removeFromCart(item.menuItem.id!);
     this.cartService.updateCartCount();
  }

 updateCartTotal() {
    this.cartTotal = this.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.menuItem.price,
      0
    );
  }



// printInvoice(order: any) {
//   const printArea = document.getElementById('printArea');

//   const formattedDate = new Date().toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   }).replace(',', '');

//   printArea!.innerHTML = `
//     <div class="bill-box" style="font-family:'Times New Roman', serif; padding:20px; background:#f7e7a9; border:2px solid #000;">  

//       <h2 style="text-align:center; margin:0;">NAVEEN'S DELHI MALAI CHAAP</h2>
//       <div style="text-align:center;">
//         Address: Thirukovilur Main Rd, Bharathi Nagar, Tiruvennanallur,<br/>
//         Tiruvannamalai, Tamil Nadu 606601
//       </div>
//       <div style="text-align:center;">Contact: 7418889585</div>
//       <br/>

//       <table style="width:100%; border-collapse:collapse; font-size:14px;">
//         <tr>
//           <td><b>Bill No:</b> ${order.orderId}</td>
//           <td><b>Bill Date:</b> ${formattedDate}</td>
//         </tr>
//         <tr>
//           <td><b>Customer:</b> ${order.customerName}</td>
//           <td><b>Mobile:</b> ${order.mobileNumber}</td>
//         </tr>
//       </table>

//       <br/>

//       <table style="width:100%; border-collapse:collapse; margin-top:10px;">
//         <thead>
//           <tr>
//             <th style="border:1px solid #000; padding:6px;">Item Name</th>
//             <th style="border:1px solid #000; padding:6px;">Rate</th>
//             <th style="border:1px solid #000; padding:6px;">Qty</th>
//             <th style="border:1px solid #000; padding:6px;">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${order.items.map((i:any)=>`
//           <tr>
//             <td style="border:1px solid #000; padding:6px;">${i.name}</td>
//             <td style="border:1px solid #000; padding:6px;">₹${i.price}</td>
//             <td style="border:1px solid #000; padding:6px;">${i.quantity}</td>
//             <td style="border:1px solid #000; padding:6px;">₹${i.totalPrice}</td>
//           </tr>
//           `).join('')}
//         </tbody>
//       </table>

//       <br/>

//       <table style="width:100%; font-size:14px;">
//         <tr>
//           <td><b>Items:</b> ${order.items.length}</td>
//           <td><b>Qty:</b> ${order.items.reduce((a:any,b:any)=>a+b.quantity,0)}</td>
//           <td><b>Total Amount:</b></td>
//           <td><b>₹${order.totalAmount}</b></td>
//         </tr>
//       </table>

//       <h3 style="text-align:center; margin-top:10px;">Net Amount: ₹${order.totalAmount}</h3>

//       <div style="margin-top:20px; text-align:center; font-weight:bold;">
//         Powered by Chanmura App<br/>
//         Thank You! Visit Again
//       </div>
//     </div>
//   `;

//   // TRIGGER PRINT
//   window.print();
// }


}
