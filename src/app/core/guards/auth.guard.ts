import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  async canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(user => {
        if (user) resolve(true);
        else { this.router.navigate(['/login']); resolve(false); }
      });
    });
  }
}
