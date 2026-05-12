import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../Model/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { StockService } from '../../services/stock.service';
import { VariantMasterService } from '../../services/variant-master.service';

@Component({
  selector: 'app-add-product.component',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
   product = {
    productId:'',
    name: '',
    categoryId: '',
    gst: 18,
    baseImage: '',
    createdAt: new Date()
  };

  ramList: any[] = [];
  storageList: any[] = [];
  colorList: any[] = [];

  categories: any[] = [];
  variants: any[] = [];

  files: File[] = [];

  constructor(
    private categoryService: CategoryService,
    private variantMaster: VariantMasterService,
    private productService: ProductsService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadVariantMasters();
    this.addVariantRow();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(c => this.categories = c);
  }

  loadVariantMasters() {
    this.variantMaster.getVariants("RAM").subscribe(v => this.ramList = v);
    this.variantMaster.getVariants("Storage").subscribe(v => this.storageList = v);
    this.variantMaster.getVariants("Color").subscribe(v => this.colorList = v);
  }

  addCategory() {
    const name = prompt("Enter category:");
    if (name) this.categoryService.addCategory(name);
  }

  addVariantMaster(type: string) {
    const name = prompt(`Add New ${type}`);
    if (name) this.variantMaster.addVariant(type, name);
  }

  addVariantRow() {
    this.variants.push({
      ram: '',
      storage: '',
      color: '',
      price: 0,
      mrp: 0,
      stock: 0,
      expiry: '',
      sku: ''
    });
  }

  onFileSelect(event: any) {
    this.files = event.target.files;
  }

  async saveProduct() {

    // create base product
    const productRef = await this.productService.createProduct(this.product);

    // upload images
    const images = await this.productService.uploadImages(
      this.product.productId,
      this.files
    );

    // save variant list
    for (const v of this.variants) {
      await this.productService.createVariant(this.product.productId, v);

      // STOCK MOVEMENT ENTRY
      await this.stockService.addStockMovement({
        productId: this.product.productId,
        variant: v,
        stockIn: v.stock,
        date: new Date(),
        reason: "New Product Creation"
      });
    }

    alert("Product Created Successfully!");
  }
}
