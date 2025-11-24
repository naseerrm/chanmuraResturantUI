import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-dashboard.component',
  imports: [CommonModule,FormsModule],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrl: './restaurant-dashboard.component.scss',
})
export class RestaurantDashboardComponent {
today = new Date().toISOString().slice(0,10);

constructor(private router : Router){

}
metrics = {
revenue: 25480,
expense: 14320,
orders: 128
};


get profit(){
return this.metrics.revenue - this.metrics.expense;
}


get profitLabel(){
return this.profit >= 0 ? 'Profit' : 'Loss';
}


trend = [60, 80, 40, 100, 90, 70, 50]; // percentages for bars


transactions = [
{ date: this.today, id: '#1001', amount: 420, type: 'Dine-in', payment: 'Card', status: 'Completed' },
{ date: this.today, id: '#1002', amount: 780, type: 'Online', payment: 'UPI', status: 'Completed' },
{ date: this.today, id: '#1003', amount: -1500, type: 'Expense', payment: 'Cash', status: 'Recorded' }
];


topItems = [
{ name: 'Chicken Biryani', qty: 45 },
{ name: 'Paneer Butter Masala', qty: 30 },
{ name: 'Masala Dosa', qty: 22 }
];
}
