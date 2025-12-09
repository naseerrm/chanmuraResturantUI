// import { Routes } from '@angular/router';
// import { MenuListComponent } from './pages/menu-list.component/menu-list.component';
// import { CartComponent } from './pages/cart.component/cart.component';
// import { TableOrderComponent } from './pages/table-order.component/table-order.component';
// import { AdminDashboardComponent } from './pages/admin-dashboard.component/admin-dashboard.component';
// import { SalesDashboardComponent } from './pages/sales-dashboard.component/sales-dashboard.component';
// import { ExpensesComponent } from './pages/expenses.component/expenses.component';


// export const routes: Routes = [
//   { path: '', redirectTo: 'menu', pathMatch: 'full' },
//   { path: 'menu', component: MenuListComponent },
//   { path: 'cart', component: CartComponent },
//   { path: 'table-order', component: TableOrderComponent },
//   { path: 'admin', component: AdminDashboardComponent },
//   { path: 'dashboard', component: SalesDashboardComponent },
//    { path: 'expenses', component: ExpensesComponent },
//   { path: '**', redirectTo: 'menu' }
// ];


import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; // implement this
import { Login } from './auth/login/login/login';
import { IndustryLayoutComponent } from './layout/industry-layout/industry-layout';
import { ForgotPassword } from './auth/forgot-password/forgot-password/forgot-password';
import { SignupComponent } from './auth/signup/signup/signup';
import { AdminDashboardComponent } from './pages/admin-dashboard.component/admin-dashboard.component';
import { CartComponent } from './pages/cart.component/cart.component';

export const routes: Routes = [
   { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  //  {
  //   path: 'auth',
  //   loadChildren: () =>
  //     import('./auth/auth.module').then(m => m.AuthModule)
  // },
 {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule)
  },
  { path: 'login', component: Login },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotpassword', component: ForgotPassword },
  

  // Dashboard uses industry layout wrapper.
 {
  path: 'dashboard',
    component: (await import('./layout/industry-layout/industry-layout')).IndustryLayoutComponent, // if using non-standalone you will import module
    canActivate: [ (await import('./core/guards/auth.guard')).AuthGuard ],
  children: [
    { path: '', redirectTo: 'restaurantDashboard', pathMatch: 'full' },
   {
      path: 'resturantTable',
      loadChildren: () =>
        import('./features/restaurant/table-order/table-order.routes').then(m => m.TABLEORDER_ROUTES)
    },
    {
      path: 'restaurantDashboard',
      loadChildren: () =>
        import('./features/restaurant/dashboard/restaurant-dashboard.routes').then(m => m.RESTAURANTDASHBOARD_ROUTES)
    },
    {
      path: 'pos',
      loadChildren: () =>
        import('./features/restaurant/pos/pos.routes').then(m => m.POS_ROUTES)
    },
    {
      path: 'orders',
      loadChildren: () =>
        import('./features/restaurant/orders/orders.routes').then(m => m.ORDERS_ROUTES)
    },
    {
      path:'kds',
      loadChildren: () => 
        import('./features/restaurant/kds/kds.routes').then(m => m.KDS_ROUTES)
    },
    {
      path: 'inventory',
      loadChildren: () =>
        import('./features/restaurant/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES)
    },
    { path: 'admin', component: AdminDashboardComponent },
    {path: 'cart', component: CartComponent },
    { path: '**', redirectTo: 'restaurantDashboard' }
  ]
},

  { path: '**', redirectTo: 'login' }
];
