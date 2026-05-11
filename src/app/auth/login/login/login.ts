import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Loadercomponent } from '../../../shared/components/loadercomponent/loadercomponent';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink,Loadercomponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
 email = '';
  password = '';
   isLoading: boolean = false;
     showPassword: boolean = false;


  constructor(private auth: AuthService, private router: Router) {}

 async login() {
  
    try {
      this.isLoading = true;
      const r = await this.auth.login(this.email.trim(), this.password);
      if (r.companyId && r.industry) {
        this.router.navigate(['/dashboard']);
      } else if (r.companyId && !r.industry) {
        this.router.navigate(['/onboarding']);
      } else {
        // no company -> treat as single-user; redirect to onboarding to create a company
        this.router.navigate(['/onboarding']);
      }
    } catch (err:any) {
      alert(err.message || 'Login failed');
      this.isLoading = false;
    } finally { this.isLoading = false; }
  }
  
  redirect(industry: string) {
    if (industry === 'Restaurant') this.router.navigate(['/dashboard-restaurant']);
    else if (industry === 'Retail') this.router.navigate(['/dashboard-retail']);
    else this.router.navigate(['/dashboard-medical']);
  }
}
