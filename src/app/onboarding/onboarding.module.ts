import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component/onboarding.component';

@NgModule({
  imports: [CommonModule, FormsModule, OnboardingRoutingModule, OnboardingComponent]
})
export class OnboardingModule {}
