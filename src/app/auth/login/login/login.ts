import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { Loadercomponent } from '../../../shared/components/loadercomponent/loadercomponent';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Loadercomponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async login() {
    try {
      this.isLoading = true;

      const response = await this.auth.login(
        this.email.trim(),
        this.password
      );

      /**
       * 🔐 Single source of truth:
       * Let guards decide where user goes
       */
      if (response?.companyId && response?.industry) {
        await this.router.navigate(['/dashboard']);
        return;
      }

      // No industry yet → onboarding
      await this.router.navigate(['/onboarding']);

    } catch (err: any) {
      alert(err?.message || 'Login failed');
    } finally {
      this.isLoading = false;
    }
  }
}
