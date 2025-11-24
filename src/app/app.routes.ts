import { Routes } from '@angular/router';
import { MenuListComponent } from './pages/menu-list.component/menu-list.component';
import { CartComponent } from './pages/cart.component/cart.component';
import { TableOrderComponent } from './pages/table-order.component/table-order.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component/admin-dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: MenuListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'table-order', component: TableOrderComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: 'menu' }
];
