import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const IndustryRedirectGuard: CanActivateChildFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const industry = auth.getIndustry();

  if (!industry) {
    return router.parseUrl('/login');
  }

  // Redirect /dashboard → /dashboard/{industry}/dashboard
  if (router.url === '/dashboard') {
    return router.parseUrl(`/dashboard/${industry}/dashboard`);
  }

  return true;
};
