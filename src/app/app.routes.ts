import { Routes } from '@angular/router';
import { IndustryLayoutComponent } from './layout/industry-layout/industry-layout';

import { Login } from './auth/login/login/login';
import { SignupComponent } from './auth/signup/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password/forgot-password';

import { AuthGuard } from './core/guards/auth.guard';
import { IndustryRedirectGuard } from './industry-role/industry-redirect.guard';
import { IndustryRoleGuard } from './industry-role/industry-role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotpassword', component: ForgotPassword },

  /* ================= DASHBOARD ROOT ================= */
  {
    path: 'dashboard',
    component: IndustryLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [IndustryRedirectGuard], // ✅ FIX
    children: [

      /* ========= MOBILE ========= */
      {
        path: 'mobile',
        canActivate: [IndustryRoleGuard],
        children: [
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./features/mobile/dashboard/mobile-dashboard.routes')
                .then(m => m.MOBILEDASHBOARD_ROUTES)
          },
          {
            path: 'admin',
            canActivate: [IndustryRoleGuard],
            data: { roles: ['admin'] },
            loadChildren: () =>
              import('./features/mobile/MobileAdmin/mobileAdmin-dashboard.routes')
                .then(m => m.ADMINPRODUCTDASHBOARD_ROUTES)
          }
        ]
      },

      /* ========= RESTAURANT ========= */
      {
        path: 'restaurant',
        canActivate: [IndustryRoleGuard],
        children: [
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./features/restaurant/dashboard/restaurant-dashboard.routes')
                .then(m => m.RESTAURANTDASHBOARD_ROUTES)
          },
          {
            path: 'pos',
            loadChildren: () =>
              import('./features/restaurant/pos/pos.routes')
                .then(m => m.POS_ROUTES)
          },
          // {
          //   path: 'admin',
          //   canActivate: [IndustryRoleGuard],
          //   data: { roles: ['admin'] },
          //   loadChildren: () =>
          //     import('./features/restaurant/admin/admin.routes')
          //       .then(m => m.ADMIN_ROUTES)
          // }
        ]
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
