import { ChangeDetectorRef, Component } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { of, Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpensesService } from '../../core/services/expenses.service';
import { Router } from '@angular/router';
import { Sidenavbarcomponent } from '../../shared/components/sidenavbarcomponent/sidenavbarcomponent';

@Component({
  selector: 'app-sales-dashboard',
  imports: [CommonModule, FormsModule,Sidenavbarcomponent],
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss'],
})
export class SalesDashboardComponent {

  selectedDate: string = '';
  today: Date = new Date();

  // Observable for the table
  filteredOrders$: Observable<any[]> | undefined;

  // Total revenue observable
revenue: number = 0;
 expense: number = 0;
profit: number = 0;
loss: number = 0;

  constructor(private firebaseService: FirebaseService,private expensesService : ExpensesService,private cdr: ChangeDetectorRef,private router : Router) {
    this.loadOrdersByDate();
     this.loadTodayFinance();
  }

async loadTodayFinance() {
  console.log("Loading today's finance data...", this.selectedDate);
   this.firebaseService.getOrderbyDate(this.selectedDate).subscribe(orders => {
 this.revenue = orders.reduce(
    (sum: number, o: any) => sum + (o.totalAmount || 0),
    0
  );
  });

   this.expensesService.getExpensesByDate(this.selectedDate).subscribe(expenses => {
    this.expense = expenses.reduce(
      (sum: number, e: any) => sum + (e.amount || 0),
      0
    );
   if (this.revenue > this.expense) {
  this.profit = this.revenue - this.expense;
  this.loss = 0;
} else {
  this.loss = this.expense - this.revenue;
  this.profit = 0;
}
this.cdr.detectChanges();  // 🔥 forces UI update
  });
  
}

  loadOrdersByDate() {
    const orders$ = this.firebaseService.getOrderbyDate(this.selectedDate).pipe(
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
this.loadTodayFinance();
    // Calculate total revenue from the same observable
  //   this.totalRevenue = orders.reduce(
  //   (sum: number, o: any) => sum + (o.totalAmount || 0),
  //   0
  // );
  }
}
