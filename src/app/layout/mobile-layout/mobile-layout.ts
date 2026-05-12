import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';
import { RestaurantContextService } from '../../features/restaurant-context.service';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-mobile-layout',
  imports: [RouterOutlet,CommonModule,MatTooltip],
  templateUrl: './mobile-layout.html',
  styleUrl: './mobile-layout.scss',
})
export class MobileLayout {
currentRoute = '';
  menus = [
    { label: 'Dashboard', path: 'mobileDashboard', icon : '📊' },
    { label: 'POS', path: 'pos', icon : '💳' },
    { label: 'Orders', path: 'orders' , icon : '🧾'},
    { label: 'Inventory', path: 'inventory', icon : '📦' },
    { label: 'Reports', path: 'reports', icon : '📈' },
    { label: 'Notification', path: 'restaurantDashboard', icon : '🔔' },
    { label: 'Hold', path: 'restaurantDashboard', icon : '✋' },
    { label: 'Admin', path: 'AdminDashboard' , icon : '👤'},
  ];
 companyName$: Observable<string> | undefined;
// User profile object
  user: {
    name: string;
    role: string;
    photoUrl?: string; // optional
  } | null = null;

  dropdownOpen: boolean = false;
  collapsed = true;
    toggle() {
      this.collapsed = !this.collapsed;
    }
  

  constructor(
    private router: Router,
    private ctx: RestaurantContextService
  ) {
     this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.currentRoute = event.urlAfterRedirects;
    }
  });
  }

  ngOnInit(): void {
    // Initialize companyName$ here, after ctx is available
    this.companyName$ = this.ctx.company$.pipe(
      map(c => c?.businessName ?? 'Chanmura Restaurant')
    );

    this.ctx.company$
    .subscribe(async company => {
      if (!company) return;   // prevent error

      console.log("company Details", company);
    });

    this.user = {
      name: 'Naseer',
      role: 'Manager',
      photoUrl: '' // Leave empty to use default avatar
    };
  }

  navigate(path: string) {
    this.router.navigate([`/dashboard/${path}`]);
  }

  logout() {
    this.ctx.logout().then(() => this.router.navigate(['/login']));
  }

  toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

goToProfile() {
  this.router.navigate(['/profile']);
}
}
