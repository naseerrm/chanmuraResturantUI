// src/app/pages/admin-dashboard/admin-dashboard.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';
import { MenuItem } from '../../core/models/menu-item.model';
import { Router } from '@angular/router';
import { RestaurantContextService } from '../../features/restaurant-context.service';
import { ProductListComponent } from '../../features/mobile/MobileAdmin/product-list.component/product-list.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, ProductListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  menuItems = signal<MenuItem[]>([]);
  selectedItem: MenuItem | null = null;
  lastMonthData: any;
  lastMonthDaily: any[] = [];
  companyId : string = '';
  industry : string = '';
  //  ngAfterViewInit() {
  //   // Only draw chart after view is initialized
  //   if (this.lastMonthDaily.length) {
  //     this.drawMonthlyChart();
  //   }
  // }


  // form model
  newItem: Partial<MenuItem> = {
    name: '',
    description: '',
    price: 0,
    category: '',
    quantityAvailable: 0,
    imageUrl: ''
  };

  selectedFile: File | null = null;
  previewImage: string | null = null;
  loading = signal(false);

  constructor(private firebaseService: FirebaseService,
     private router: Router,
     private restaurantContext : RestaurantContextService) {
    
    this.restaurantContext.userDetail$
    .subscribe(user => {
      if (!user) return;   // prevent error

      this.companyId = user.companyId;
      console.log(this.companyId);
      this.loadItems();
    });
    this.restaurantContext.company$.subscribe(company => {
if(company){
  this.industry = company.industry;
}
    });
  }
// load items from Firestore for Restaurant Details

  async loadLastMonthSales() {
  const data = await this.firebaseService.getLastMonthStats();
  this.lastMonthData = data;
  this.lastMonthDaily = Object.keys(data.daily).map(key => ({
    date: key,
    revenue: data.daily[key]
  }));

  //this.drawMonthlyChart();
}
  // load items from Firestore
  async loadItems() {
    try {
      const items = await this.firebaseService.getMenuItems(this.companyId);
      this.menuItems.set(items);
      const data = await this.firebaseService.getLastMonthStats();

  this.lastMonthData = data;
  this.lastMonthDaily = Object.keys(data.daily).map(key => ({
    date: key,
    revenue: data.daily[key]
  }));

  //this.drawMonthlyChart();
    } catch (err) {
      console.error('Load items error', err);
    }
  }

  onFileSelected(event: any) {
    if (!event?.target?.files?.length) return;
    this.selectedFile = event.target.files[0];

    // preview using FileReader
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      this.newItem.imageUrl = this.previewImage!;
    };
    reader.readAsDataURL(this.selectedFile!);
  }

  async addMenuItem() {
    if (!this.newItem.name || !this.newItem.price || this.newItem.quantityAvailable == null) {
      alert('Please fill name, price and quantity');
      return;
    }

    this.loading.set(true);
    try {
      let imageUrl = this.newItem.imageUrl || '';

      // // If a file is selected, upload to Firebase Storage
      // if (this.selectedFile) {
      //   imageUrl = await this.firebaseService.uploadImage(this.selectedFile);
      // }

      const payload: Omit<MenuItem, 'id'> = {
        name: this.newItem.name!,
        description: this.newItem.description || '',
        price: Number(this.newItem.price),
        category: this.newItem.category || '',
        imageUrl,
        quantityAvailable: Number(this.newItem.quantityAvailable),
        isAvailable: true,
        quantity: 0,
      };

      await this.firebaseService.addMenuItem(this.companyId,payload);

      // reset form & reload list
      this.newItem = { name: '', description: '', price: 0, category: '', quantityAvailable: 0, imageUrl: '' };
      this.selectedFile = null;
      this.previewImage = null;

      await this.loadItems();
    } catch (err) {
      console.error('Add item error', err);
      alert('Failed to add item');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteItem(item: MenuItem) {
    if (!item.id) return;
    if (!confirm(`Delete "${item.name}"?`)) return;
    await this.firebaseService.deleteMenuItem(this.companyId,item.id);
    await this.loadItems();
  }

editItem(item: MenuItem) {
  this.selectedItem = { ...item };  // Copy object
}

cancelEdit() {
  this.selectedItem = null;
  this.previewImage = null;
}

async updateItem() {
  if (!this.selectedItem || !this.selectedItem.id) return;
  if(this.newItem.imageUrl){
    this.selectedItem.imageUrl = this.newItem.imageUrl;
  }
  this.loading.set(true);
  await this.firebaseService.updateMenuItem(this.companyId,this.selectedItem.id, this.selectedItem);

  alert("Item updated successfully!");

  this.selectedItem = null; // close form

  // reset form & reload list
      this.newItem = { name: '', description: '', price: 0, category: '', quantityAvailable: 0, imageUrl: '' };
      this.selectedFile = null;
      this.previewImage = null;

 this.loading.set(false);
  // Reload list
  this.loadItems();
}

  // decrease stock manually
  async decreaseStock(item: MenuItem, amount = 1) {
    if (!item.id) return;
    const newQty = Math.max(0, (item.quantityAvailable || 0) - amount);
    await this.firebaseService.updateMenuItem(this.companyId,item.id, { quantityAvailable: newQty });
    await this.loadItems();
  }


  // load items from Firestore For Mobile I
}
