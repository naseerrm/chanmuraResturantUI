import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RestaurantLayoutComponent } from '../restaurant-layout/restaurant-layout';
import { RetailLayoutComponent } from '../retail-layout/retail-layout';
import { MedicalLayoutComponent } from '../medical-layout/medical-layout';

@Component({
  selector: 'app-industry-layout',
  imports: [CommonModule,RestaurantLayoutComponent,RetailLayoutComponent,MedicalLayoutComponent],
  templateUrl: './industry-layout.html',
  styleUrl: './industry-layout.scss'
})
export class IndustryLayoutComponent {
 industry$: Observable<string | null>;
  isLoading: boolean = true;
  constructor(private auth: AuthService, private router: Router) {
    console.log(this.auth);
    this.industry$ = this.auth.industry$;
    this.isLoading = false;
  }

  logout() {
    this.auth.logout().then(()=> this.router.navigate(['/auth/login']));
  }
}
