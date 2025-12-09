import { Component, EventEmitter, Input, Output, output, signal } from '@angular/core';
import { CartItem, CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-bill-summary',
  imports: [CommonModule,FormsModule],
  templateUrl: './bill-summary.html',
  styleUrl: './bill-summary.scss',
})
export class BillSummaryComponent {

  @Input() cartItems: CartItem[] = [];
  @Input() upiQrCode: string | null = null;

  @Output() orderConfirmed = new EventEmitter<{
    purchaserName: string;
    mobileNumber: string;
    paymentMethod: string;
    paidAmount?: number;
  }>();

  purchaserName = '';
  mobileNumber = '';
  paymentMethod = 'Cash';
  paidAmount : number = 0;
  loading = signal(false);
  subtotal = 0;
  cgst = 0;
  sgst = 0;
  grandTotal = 0;
  billNo = '';

  constructor (private firebaseService : FirebaseService,
    private cartService : CartService, private router : Router,private cdr: ChangeDetectorRef
  ) {}


    ngAfterViewInit() {
    // Run detectChanges to fix ExpressionChangedAfterItHasBeenCheckedError
    this.cdr.detectChanges();
  }


  // ----------------------------
  //  CHECKOUT + BILLING
  // ----------------------------
  checkout() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    console.log(this.cartItems);
    this.generateBillNumber();
    this.calculateBill();
    this.showModal();
  }

  calculateBill() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    this.cgst = +(this.subtotal * 0.025).toFixed(2);
    this.sgst = +(this.subtotal * 0.025).toFixed(2);
    this.grandTotal = +(this.subtotal + this.cgst + this.sgst).toFixed(2);
  }

  generateBillNumber() {
    this.billNo = 'BILL-' + Date.now();
  }

  showModal() {
    const modalElement = document.getElementById('billModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

   async confirmOrder() {
  if (!this.cartItems.length) return alert('Cart is empty!');
  if (!this.purchaserName?.trim() || !this.mobileNumber?.toString().trim()) {
    return alert('Enter customer name and mobile number!');
  }
  if (!this.paymentMethod) return alert('Select payment method!');
  if (this.paidAmount <= 0 && this.paymentMethod == "Cash") return alert('Enter amount received!');

  this.loading.set(true);

  const orderData = {
    customerName: this.purchaserName,
    mobileNumber: this.mobileNumber,
    items: this.cartItems.map(i => ({
      id: i.menuItem.id,
      name: i.menuItem.name,
      price: i.menuItem.price,
      quantity: i.quantity,
      totalPrice: i.menuItem.price * i.quantity
    })),
    subtotal: this.subtotal,
    cgst: this.cgst,
    sgst: this.sgst,
    totalAmount: this.paymentMethod == 'Cash' ? Math.round(this.grandTotal) : this.grandTotal,
    paymentMethod: this.paymentMethod,
    paidAmount: this.paymentMethod == 'Cash' ? Math.round(this.paidAmount) : this.paidAmount,
    balanceAmount: this.paymentMethod == 'Cash' ? Math.round(this.paidAmount) - Math.round(this.grandTotal) : this.paidAmount - this.grandTotal, // positive if change due
    DateTime: new Date().toLocaleString()
  };

  try {
    const { orderId, docId } = await this.firebaseService.placeOrderAtomic(orderData);

    alert(`Order placed — Order #${orderId}`);
     (document.body as any).classList.remove('modal-open');
document.querySelectorAll('.modal-backdrop').forEach(e => e.remove());


    const invoiceObj = { ...orderData, orderId, createdAt: new Date().toLocaleString() };
    this.printInvoice(invoiceObj);

    this.cartService.clearCart();
    this.cartService.updateCartCount();
    this.router.navigate(['/dashboard/orders']);
  } catch (err) {
    console.error('placeOrderAtomic failed', err);
    alert('Failed to place order — try again');
  } finally {
    this.loading.set(false);
  }
}

printInvoice(order: any) {
  const invoiceWindow = window.open('', '_blank', 'width=600,height=800');

  if (!invoiceWindow) {
    alert('Failed to open invoice window. Please allow pop-ups for this site.');
    return;
  }

  const formattedDate = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', '');

  invoiceWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: "Times New Roman", serif;
            font-size: 10pt; /* Adjusted for better readability */
            padding: 10px;
            background: #f7e7a9; /* light yellow like the sample */
            color: #000;
            margin: 0;
          }
          .bill-box {
            border: 2px solid #000;
            padding: 10px;
            width: 100%;
          }
          h2, h3, h4 {
            text-align: center;
            margin: 0;
            padding: 0;
          }
          .center {
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
          }
          th, td {
            border: 1px solid #000;
            padding: 3px; /* Reduced padding for thermal printer */
            font-size: 9pt; /* Adjusted font size */
          }
          th {
            text-align: left;
          }
          .no-border td {
            border: none;
          }
          .footer-msg {
            margin-top: 10px;
            text-align: center;
            font-weight: bold;
            font-size: 9pt;
          }
          button {
            padding: 5px 15px;
            font-size: 10pt;
            margin-top: 10px;
            cursor: pointer;
          }
        </style>
      </head>

      <body>
        <div class="bill-box">

          <h2>NAVEEN'S DELHI MALAI CHAAP</h2>
          <div class="center">Thirukovilur Main Rd, Bharathi Nagar, Tiruvennanallur, Tiruvannamalai, Tamil Nadu 606601</div>
          <div class="center">Contact: 74188 89585</div>
          <br/>

          <table class="no-border">
            <tr>
              <td><b>Bill No:</b> ${order.orderId}</td>
              <td><b>Bill Date:</b> ${formattedDate}</td>
            </tr>
            <tr>
              <td><b>Customer:</b> ${order.customerName}</td>
              <td><b>Mobile:</b> ${order.mobileNumber}</td>
            </tr>
          </table>

          <br/>

          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((i: any) => `
              <tr>
                <td>${i.name}</td>
                <td>₹${i.price}</td>
                <td>${i.quantity}</td>
                <td>₹${i.totalPrice}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>

          <br/>

          <table class="no-border">
            <tr>
              <td><b>Items:</b> ${order.items.length}</td>
              <td><b>Qty:</b> ${order.items.reduce((a: any, b: any) => a + b.quantity, 0)}</td>
              <td><b>Total Amount:</b></td>
              <td><b>₹${order.totalAmount}</b></td>
            </tr>
          </table>

          <h3 style="text-align:center;">Net Amount: ₹${order.totalAmount}</h3>

          <br/>

          <div class="footer-msg">
            GOODS SOLD CANNOT BE RETURNED OR REFUNDED<br/>
            Thank You! Visit Again
          </div>

        </div>

        <br/>
        <div class="center">
          <button onclick="window.print()">Print Invoice</button>
        </div>

      </body>
    </html>
  `);

  invoiceWindow.document.close();
}
}
