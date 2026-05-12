import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const IndustryRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const userIndustry = auth.getIndustry();
  const userRole = auth.getRole();

  const routeIndustry = route.parent?.url[0]?.path;
  console.log(routeIndustry);
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
   console.log(allowedRoles);

  if (userIndustry !== routeIndustry) {
    return router.parseUrl(`/dashboard/${userIndustry}/dashboard`);
  }

  if (allowedRoles && !allowedRoles.includes(userRole!)) {
    return router.parseUrl(`/dashboard/${userIndustry}/dashboard`);
  }

  return true;
};
