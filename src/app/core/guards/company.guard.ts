import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const ind = await firstValueFrom(this.auth.industry$);
    if (ind) return true;
    // not set, navigate to onboarding
    this.router.navigate(['/onboarding']);
    return false;
  }
}
