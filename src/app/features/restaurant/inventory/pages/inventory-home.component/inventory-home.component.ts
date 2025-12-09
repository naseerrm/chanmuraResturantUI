import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ExpensesService } from '../../../../../core/services/expenses.service';
import { Router } from '@angular/router';
import { Expenses } from '../../../../../core/models/expenses.model';

@Component({
  selector: 'app-inventory-home.component',
  imports: [CommonModule,FormsModule],
  templateUrl: './inventory-home.component.html',
  styleUrl: './inventory-home.component.scss',
})
export class InventoryHomeComponent {
 selectedDate: string = '';
    // Observable for the table
 expenses$: Observable<any[]> | undefined;
   // Total expenses observable
  totalExpense$: Observable<number> | undefined;

  newExpense = {
    title: '',
    amount: 0,
    note: ''
  };

  editingItem: any = null;
   loading = signal(false);

  constructor(private expensesService: ExpensesService,private router : Router) {}

  ngOnInit() {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.loadExpenses();
  }

  loadExpenses() {
    if (!this.selectedDate) return;

    const expenses$ = this.expensesService.getExpensesByDate(this.selectedDate).pipe(
      map(expenses => 
        expenses
          .map(o => ({
            ...o,
            createdAt: o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt),
            showItems: false  // initialize expand/collapse state
          }))
           .sort((a, b) => Number(a.orderId) - Number(b.orderId)) // ✅ ascending
      )
    );

    this.expenses$ = expenses$;

    // Calculate total revenue from the same observable
    this.totalExpense$ = expenses$.pipe(
      map(expenses => expenses.reduce((sum, o) => sum + Number(o.amount || 0), 0))
    );
  }

  async addExpense() {
    this.loading.set(true);
    const expenses : Expenses = {
      createdAt: new Date(this.selectedDate),
      title: this.newExpense.title,
      amount: this.newExpense.amount,
      note: this.newExpense.note
    }
    await this.expensesService.addExpense(expenses);
    this.newExpense = { title: '', amount: 0, note: '' };
     this.loading.set(false);
    
  }

  editExpense(item: any) {
    this.editingItem = { ...item };
  }

  async saveEdit() {
    await this.expensesService.updateExpense(
      this.selectedDate,
      this.editingItem.id,
      this.editingItem
    );
    this.editingItem = null;
  }

  async removeExpense(id: string) {
    await this.expensesService.deleteExpense(this.selectedDate, id);
  }
}
