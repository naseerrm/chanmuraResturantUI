import { ChangeDetectorRef, Component } from '@angular/core';
import { FirebaseService } from '../../../../../core/services/firebase.service';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-customerorder',
  imports: [CommonModule,FormsModule],
  templateUrl: './customerorder.html',
  styleUrl: './customerorder.scss',
})
export class CustomerOrderComponent {

  // Observable for the table
  filteredOrders$: Observable<any[]> | undefined;
today: string = new Date().toISOString().split('T')[0];

lastOrders = [

  {
    orderId: 'ORD1001',
    date: '10 May 2026 - 08:30 PM',
    items: 'Delhi Malai Chaap, Paneer Tikka',
    amount: 540,
    status: 'Delivered'
  },

  {
    orderId: 'ORD1002',
    date: '08 May 2026 - 07:10 PM',
    items: 'Veg Fried Rice',
    amount: 220,
    status: 'Delivered'
  },

  {
    orderId: 'ORD1003',
    date: '05 May 2026 - 09:15 PM',
    items: 'Butter Naan, Paneer Butter Masala',
    amount: 480,
    status: 'Delivered'
  },

  {
    orderId: 'ORD1004',
    date: '01 May 2026 - 06:45 PM',
    items: 'Momos Combo',
    amount: 260,
    status: 'Cancelled'
  },

  {
    orderId: 'ORD1005',
    date: '28 Apr 2026 - 10:00 PM',
    items: 'Delhi Malai Chaap',
    amount: 180,
    status: 'Delivered'
  }

];

   constructor(private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef) {
    this.loadOrdersByDate();
  }

    loadOrdersByDate() {
  setTimeout(() => {

    const orders$ = this.firebaseService.getOrderbyDate(this.today).pipe(
      map(orders => 
        orders
          .map(o => ({
            ...o,
            createdAt: o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt),
            showItems: false  // initialize expand/collapse state
          }))
           .sort((a, b) => Number(a.orderId) - Number(b.orderId)) // ✅ ascending
      )
    );

    this.filteredOrders$ = orders$;
   
  // 👉 Log the actual data by subscribing
  orders$.subscribe(data => {
    console.log("Orders for date:", this.today, data);
  });
  }, 2000);
  }
}
