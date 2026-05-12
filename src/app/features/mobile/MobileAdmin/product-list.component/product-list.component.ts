import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone:true,
  imports:[FormsModule,CommonModule,RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Array<{ product: any, variantCount: number, id: string }> = [];
  loading = false;

  constructor(private svc: ProductsService) {}

  async ngOnInit() {
 try {
      this.loading = true;
      this.products = await this.svc.listProductsWithVariantCount();
    } catch (err:any) {
      console.error(err);
       this.loading = false;
      alert('Error saving product: ' + (err?.message || err));
    } finally {
      this.loading = false;
    }

  }
}
