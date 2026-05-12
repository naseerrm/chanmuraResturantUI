import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../Model/product.model';
import { ProductVariant } from '../../Model/variant.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  imports:[FormsModule,CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productId: string | null = null;
  product: Product = {
    name: '',
    categoryId: '',
    brand: '',
    gst: 18,
    isVariant: true,
    images: []
  };
  variants: ProductVariant[] = [];
  categories: any[] = [];
  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  loading = false;
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: ProductsService
  ) {}

  async ngOnInit() {
    this.categories = await this.svc.getCategories();

    this.productId = this.route.snapshot.params['id'] || null;
    if (this.productId) {
      this.isEdit = true;
      const res = await this.svc.getProductWithVariants(this.productId);
      if (res.product) {
        this.product = { ...res.product };
        this.variants = res.variants;
        this.imagePreviews = this.product.images || (this.product.baseImage ? [this.product.baseImage] : []);
      }
    } else {
      this.addVariant(); // start with one row
    }
  }

  addVariant() {
    this.variants.push({
      ram: '',
      storage: '',
      color: '',
      mrp: 0,
      price: 0,
      stock: 0,
      sku: ''
    });
  }

  removeVariant(i: number) {
    const v = this.variants[i];
    // if existing variant (has variantId) you might want to delete from db - handle on save or add explicit delete
    this.variants.splice(i, 1);
  }

  onImageSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    for (let i = 0; i < input.files.length; i++) {
      const f = input.files[i];
      this.imageFiles.push(f);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(f);
    }
  }

  async save() {
    try {
      this.loading = true;
      if (this.isEdit && this.productId) {
        await this.svc.updateProductWithVariants(this.productId, this.product, this.variants, this.imageFiles);
        alert('Product updated');
      } else {
        const newId = await this.svc.createProductWithVariants(this.product, this.variants, this.imageFiles);
        alert('Product created: ' + newId);
      }
      this.router.navigate(['/admin/products']);
    } catch (err:any) {
      console.error(err);
      alert('Error saving product: ' + (err?.message || err));
    } finally {
      this.loading = false;
    }
  }

  // quick auto-sku fill for a variant row
  fillSkuForVariant(i: number) {
    const v = this.variants[i];
    v.sku = this.svc.generateSKU(this.product.name || 'PRD', v);
  }
}
