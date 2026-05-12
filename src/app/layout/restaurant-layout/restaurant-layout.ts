import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RestaurantContextService } from '../../features/restaurant-context.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-restaurant-layout',
  imports:[CommonModule,RouterOutlet,MatTooltip],
  templateUrl: './restaurant-layout.html',
  styleUrls: ['./restaurant-layout.scss']
})
export class RestaurantLayoutComponent implements OnInit {
currentRoute = '';
  menus = [
    { label: 'Dashboard', path: 'restaurantDashboard', icon : '📊',roles: ['OWNER'] },
    { label: 'POS', path: 'pos', icon : '💳' ,roles: ['user']},
    { label: 'Table', path: 'resturantTable' , icon : '🍽️',roles: ['OWNER']},
    { label: 'Orders', path: 'orders' , icon : '🧾',roles: ['OWNER']},
    { label: 'KDS', path: 'kds', icon : '👨‍🍳' ,roles: ['OWNER']},
    { label: 'Inventory', path: 'inventory', icon : '📦',roles: ['OWNER'] },
    { label: 'Reports', path: 'reports', icon : '📈',roles: ['OWNER'] },
    { label: 'Notification', path: 'restaurantDashboard', icon : '🔔', roles: ['OWNER', 'user'] },
    { label: 'Hold', path: 'restaurantDashboard', icon : '✋' ,roles: ['OWNER']},
    { label: 'Admin', path: 'admin' , icon : '👤',roles: ['OWNER']},
    { label: 'Cart', path: 'cart', icon : '🛒',roles: ['user'] },
    { label: 'Your Order', path: 'customerOrders', icon : '🧾',roles: ['user'] }
  ];
  filteredMenus: any[] = [];
 companyName$: Observable<string> | undefined;
IsAdmin$: string = '';
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

    this.ctx.userDetail$
    .subscribe(async user => {
      if (!user) return;   // prevent error
console.log('User details:', user);
      this.IsAdmin$ = user?.role === 'OWNER' ? 'OWNER' : 'user';
       this.filteredMenus = this.menus.filter(menu =>
      menu.roles.includes(user.role)
    );
    });

    this.ctx.company$
    .subscribe(async company => {
      if (!company) return;   // prevent error

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
