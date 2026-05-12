// import { Component } from '@angular/core';
// import { AuthService } from '../../../core/services/auth.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { SignupModel } from '../../../core/models/signup.model';

// @Component({
//   selector: 'app-signup',
//   imports: [CommonModule,FormsModule],
//   templateUrl: './signup.html',
//   styleUrl: './signup.scss',
// })
// export class Signup {
// companyCode = '';
// email = '';
//   mobile = '';
//   password = '';
//   confirmPassword = '';


//   constructor(private auth: AuthService, private router: Router) {}

//   signup() {
//     if(this.password !== this.confirmPassword){
//       alert("Passwords do not match");
//       return;
//     }
//        const newSignUp : SignupModel = {
//           createdAt : new Date(),
//           companyCode : this.companyCode,
//           mobile : this.mobile,
//           password : this.password,
//           email : this.email,
//           confirmPassword :this.confirmPassword
//         }
//     this.auth.signup(newSignUp)
//       .then(industry => this.redirect(industry))
//       .catch(err => alert(err.message));
//   }

//   redirect(industry: string) {
//     if (industry === 'Restaurant') this.router.navigate(['/dashboard-restaurant']);
//     else if (industry === 'Retail') this.router.navigate(['/dashboard-retail']);
//     else this.router.navigate(['/dashboard-medical']);
//   }

//   goToLogin(){
//     this.router.navigate(['login']);
//   }
// }

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyService } from '../../../core/services/company.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupModel } from '../../../core/models/signup.model';

@Component({
   selector: 'app-signup',
   imports: [CommonModule,FormsModule,RouterLink],
   templateUrl: './signup.html',
   styleUrl: './signup.scss',
})
export class SignupComponent {
  email = '';
  mobile = '';
  password = '';
  confirmPassword = '';
  companyCode = 'chan001';   // optional: owner may create new company or enter existing
  isOwner = false;
  loading = false;

  constructor(private auth: AuthService, private cs: CompanyService, private router: Router) {}

  async signup() {
    try {
      if(this.password !== this.confirmPassword){
       alert("Passwords do not match");
       return;
    }
      this.loading = true;
      // if companyCode given but company does not exist -> will be created later on onboarding
      const r = await this.auth.signup(this.email,this.mobile.trim(), this.password, this.isOwner, this.companyCode?.trim() || undefined);
      // if company already exists and has industry -> direct dashboard
      if (this.companyCode) {
        const comp = await this.cs.getCompany(this.companyCode.trim());
        if (comp && comp.industry) {
          // industry set -> go to dashboard
          this.router.navigate(['/dashboard']);
          return;
        }
      }
      // otherwise onboarding required
      this.router.navigate(['/onboarding']);
    } catch (err: any) {
  if (err.code === 'auth/email-already-in-use') {
    let message = 'This email is already registered. Please login instead!';
  }

  alert("message");
} finally { this.loading = false; }
  }
}


