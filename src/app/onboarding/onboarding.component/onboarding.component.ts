import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-onboarding',
  imports :[CommonModule,FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl :'./onboarding.component.scss'
})
export class OnboardingComponent implements OnInit {
  companyCode = '';
  businessName = '';
  industry = '';
  address = '';
  gst = '';
  loading = false;

  industries = ['Restaurant', 'Retail', 'Medical', 'Electrical'];

  constructor(private cs: CompanyService, private auth: AuthService, private fs: Firestore, private router: Router) {}

  async ngOnInit() {
    const uid = this.auth.getCurrentUid();
    if (!uid) { this.router.navigate(['/auth/login']); return; }

    // read users/{uid} to extract companyId
    const uSnap = await getDoc(doc(this.fs, `users/${uid}`));
    if (!uSnap.exists()) { this.router.navigate(['/auth/login']); return; }

    const u = uSnap.data() as any;
    this.companyCode = u.companyId ?? u.companyCode ?? ''; // support both fields if you used companyCode earlier
    // if company exists, load details
    if (this.companyCode) {
      const company = await this.cs.getCompany(this.companyCode);
      if (company) {
        this.businessName = company.businessName ?? '';
        this.industry = company.industry ?? '';
        this.address = company.address ?? '';
        this.gst = company.gst ?? '';
        // if industry already set, redirect straight to dashboard
        if (this.industry) {
          this.auth['industrySubject']?.next(this.industry);
          this.router.navigate(['/dashboard']);
          return;
        }
      }
    }
  }

  async submit() {
    if (!this.companyCode) {
      // if no code provided - generate or ask user to enter a unique code
      alert('Company code is missing. Choose a unique code.');
      return;
    }
    this.loading = true;
    try {
      await this.cs.updateCompany(this.companyCode, {
        companyCode: this.companyCode,
        businessName: this.businessName,
        industry: this.industry,
        address: this.address,
        gst: this.gst
      });

      // set industry
      await this.auth.setIndustryForCompany(this.companyCode, this.industry);
      this.router.navigate(['/dashboard']);
    } catch (err:any) {
      alert(err.message || 'Failed to save company');
    } finally { this.loading = false; }
  }
}
