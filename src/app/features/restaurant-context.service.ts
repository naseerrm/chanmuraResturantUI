// restaurant-context.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, of, shareReplay } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { CompanyService } from '../core/services/company.service';

@Injectable({ providedIn: 'root' })
export class RestaurantContextService {

  private userDetailSubject = new BehaviorSubject<any | null>(null);
  private companySubject = new BehaviorSubject<any | null>(null);

  userDetail$ = this.userDetailSubject.asObservable();
  company$ = this.companySubject.asObservable();

  constructor(private auth: AuthService, private cs: CompanyService) {
    this.init();
  }

  private init() {
    this.auth.userUid$
      .pipe(
        switchMap(uid => {
          if (!uid) {
            this.userDetailSubject.next(null);
            this.companySubject.next(null);
            return of(null);
          }
          // Fetch user details
          return this.cs.getUserdetails(uid);
        })
      )
      .subscribe(user => {
        this.userDetailSubject.next(user);

        // Fetch company whenever user has a companyId
        if (user?.companyId) {
          this.cs.getCompany(user.companyId)
            .then(company => this.companySubject.next(company))
            .catch(() => this.companySubject.next(null));
        } else {
          this.companySubject.next(null);
        }
      });
  }

  logout() {
    return this.auth.logout();
  }
}
