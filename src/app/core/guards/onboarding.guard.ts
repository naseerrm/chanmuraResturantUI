import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CompanyService } from '../services/company.service';

@Injectable({ providedIn: 'root' })
export class OnboardingGuard implements CanActivate {
  constructor(private authSvc: AuthService, private cs: CompanyService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const uid = this.authSvc.getCurrentUid();
    if (!uid) { this.router.navigate(['/auth/login']); return false; }

    // read users/{uid}
    // For simplicity, fetch via companyService-> get user's company via users collection (we do a small check)
    // We'll attempt to read companies via authSvc.user$ or call Firestore directly
    // but keep it simple: rely on authSvc.industry$
    const industry = await new Promise<string | null>((res) => {
      this.authSvc.industry$.subscribe(i => res(i));
    });

    if (industry) return true;
    this.router.navigate(['/onboarding']);
    return false;
  }
}
