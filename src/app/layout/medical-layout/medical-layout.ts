import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medical-layout',
  templateUrl: './medical-layout.html',
  styleUrl: './medical-layout.scss',
  imports: [RouterOutlet,CommonModule],
})
export class MedicalLayoutComponent {
  menus = [
    { label: 'POS', path: 'pos' },
    { label: 'Pharmacy', path: 'pharmacy' },
    { label: 'Expiry Alerts', path: 'expiry' },
    { label: 'Suppliers', path: 'suppliers' },
    { label: 'Reports', path: 'reports' }
  ];
  companyName = 'Chanmura Pharmacy';

  constructor(private router: Router, private auth: AuthService) {}
  navigate(p: string) { this.router.navigate([`/dashboard/${p}`]); }
  logout() { this.auth.logout().then(()=> this.router.navigate(['/login'])); }
}

