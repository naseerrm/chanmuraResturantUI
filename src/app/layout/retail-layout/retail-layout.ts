import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retail-layout',
  templateUrl: './retail-layout.html',
  styleUrl: './retail-layout.scss',
  imports: [RouterOutlet,CommonModule],
})
export class RetailLayoutComponent {
  menus = [
    { label: 'POS', path: 'pos' },
    { label: 'Billing', path: 'billing' },
    { label: 'Stock', path: 'stock' },
    { label: 'Customers', path: 'customers' },
    { label: 'Reports', path: 'reports' }
  ];
  companyName = 'Chanmura Retail';

  constructor(private router: Router, private auth: AuthService) {}

  navigate(p: string) { this.router.navigate([`/dashboard/${p}`]); }
  logout() { this.auth.logout().then(()=> this.router.navigate(['/login'])); }
}

