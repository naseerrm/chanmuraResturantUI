import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { MenuItem } from '../../core/models/menu-item.model';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-admin-dashboard',
  imports : [CommonModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  orders: Order[] = [];
  menuItems = signal<MenuItem[]>([]);
 selectedFile: File | null = null;
 previewImage: string | null = null;
  
  newItem: Partial<MenuItem> = {
    name: '',
    price: 0,
    quantityAvailable: 0,
    imageUrl: ''
  };

  constructor(private orderService: OrderService,private adminService: AdminService,private firebaseService: FirebaseService) {
    this.loadMenuItems();
  }

  ngOnInit(): void {
    this.orders = this.orderService.getOrders();
     this.menuItems = this.adminService.getMenuItems();
  }

  // Load menu items from Firebase
  loadMenuItems() {
    this.firebaseService.getMenuItems().subscribe(items => {
      this.menuItems.set(items);
    });
  }

onFileSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;   // Base64 preview
      this.newItem.imageUrl = this.previewImage;     // store in newItem
    };

    reader.readAsDataURL(this.selectedFile!);        // <-- non-null assertion
  }
}


  updateStatus(order: Order, status: OrderStatus) {
    this.orderService.updateStatus(order.id, status);
  }

  addMenuItem() {
  if (!this.newItem.name || !this.newItem.price || !this.newItem.quantityAvailable) return;

  this.adminService.addMenuItem({
    id: 0, // will be set in service
    name: this.newItem.name,
    price: this.newItem.price,
    quantityAvailable: this.newItem.quantityAvailable,
    description: this.newItem.description || '',
    category: this.newItem.category || '',
    isAvailable: true,
    quantity: 0,
    imageUrl: this.newItem.imageUrl || '' // Base64 preview
  });
console.log('Added menu item:', this.newItem);
this.firebaseService.addMenuItem(this.newItem as MenuItem).then(() => {
      this.newItem = { name: '', price: 0, quantityAvailable: 0, imageUrl: '' };
      this.previewImage = null;
      this.selectedFile = null;
    });
  // Reset form
  this.newItem = { name: '', price: 0, quantityAvailable: 0, imageUrl: '' };
  this.previewImage = null;
  this.selectedFile = null;
}



  decreaseQuantity(item: MenuItem, count: number) {
    if (count <= 0) return;
    this.adminService.decreaseQuantity(item.id, count);
  }
}
