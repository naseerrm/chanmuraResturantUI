import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndustryLayoutComponent } from './industry-layout/industry-layout';
import { MedicalLayoutComponent } from './medical-layout/medical-layout';
import { RetailLayoutComponent } from './retail-layout/retail-layout';
import { RestaurantLayoutComponent } from './restaurant-layout/restaurant-layout';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IndustryLayoutComponent,
     RestaurantLayoutComponent,
    RetailLayoutComponent,
    MedicalLayoutComponent,
    MatTooltipModule
  ],
  exports: [IndustryLayoutComponent]
})
export class LayoutModule {}
