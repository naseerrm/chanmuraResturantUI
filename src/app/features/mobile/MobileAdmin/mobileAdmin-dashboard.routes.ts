import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component/product-list.component';
import { EditProductComponent } from './edit-product.component/edit-product.component';
import { AddProductComponent } from './add-product.component/add-product.component';

export const ADMINPRODUCTDASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: '',
    component: AddProductComponent
  },
  {
    path: '',
    component: EditProductComponent
  }
];
