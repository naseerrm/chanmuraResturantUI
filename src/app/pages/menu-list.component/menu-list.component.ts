import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../core/models/menu-item.model';
import { CartItem, CartService } from '../../core/services/cart.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Loadercomponent } from "../../shared/components/loadercomponent/loadercomponent";
import { RestaurantContextService } from '../../features/restaurant-context.service';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Loadercomponent],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  menuItems = signal<MenuItem[]>([]);
  cartItems: CartItem[] = [];
 isLoading: boolean = true;
 cartItemCount : number = 0;
 searchText: string = '';
selectedCategory: string = '';
minPrice: number | null = null;
maxPrice: number | null = null;
sortOrder: string = ''; // "asc" | "desc"
availabilityFilter: string = ''; // "", "in", "out"
currentPage: number = 1;
itemsPerPage: number = 8; // change as per your need
  companyId : string = '';


  constructor(
    private cartService: CartService,
    private firebaseService: FirebaseService,
    private router: Router,
    private restaurantContext : RestaurantContextService
  ) {}

async ngOnInit() {
  //this.isLoading = true;
this.restaurantContext.userDetail$
    .subscribe(async user => {
      if (!user) return;   // prevent error

      this.companyId = user.companyId;
      //console.log(this.companyId);
      const menu = await this.firebaseService.getMenuItems(this.companyId);
  this.menuItems.set(menu);

  // Sync menu item quantity with cart items
  this.cartService.cartItems$.subscribe(cartItems => {
    this.cartItems = cartItems;
    this.cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const updatedMenu = menu.map(menuItem => {
      const cartItem = cartItems.find(ci => ci.menuItem.id === menuItem.id);
      return {
        ...menuItem,
        quantity: cartItem ? cartItem.quantity : 0
      };
    });

    this.menuItems.set(updatedMenu);
    this.isLoading = false; // Loader hide here once both data loaded
    });
  
  });
}


filteredMenuItems() {
  let items = this.menuItems();
  // 1️⃣ Search Filter
  if (this.searchText.trim()) {
    const search = this.searchText.toLowerCase();
    items = items.filter(item =>
      item.name.toLowerCase().includes(search)
    );
  }

  // 2️⃣ Category Filter (VEG/NON-VEG)
  if (this.selectedCategory) {
    items = items.filter(item =>
      item.category === this.selectedCategory
    );
  }

  // 3️⃣ Price Range Filter
  if (this.minPrice !== null) {
    items = items.filter(item => item.price >= this.minPrice!);
  }

  if (this.maxPrice !== null) {
    items = items.filter(item => item.price <= this.maxPrice!);
  }
  
    // ⭐ Availability Filter
  if (this.availabilityFilter === "in") {
    items = items.filter(item => item.quantityAvailable > 0);
  } 
  else if (this.availabilityFilter === "out") {
    items = items.filter(item => item.quantityAvailable === 0);
  }

  // 4️⃣ Sorting by Price
  if (this.sortOrder === 'asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (this.sortOrder === 'desc') {
    items.sort((a, b) => b.price - a.price);
  }

  return items;
}


get totalPages() {
  return Math.ceil(this.filteredMenuItems().length / this.itemsPerPage);
}

paginatedItems() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredMenuItems().slice(start, end);
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


viewCart(){
  this.router.navigate(['/cart']);
}

onImageError(event: any) {
  event.target.src = 'assets/default.jpg';
}


  increaseQuantity(item: MenuItem) {
    item.quantity = (item.quantity || 0) + 1;
    this.cartService.addToCart(item, 1);
  }

  decreaseQuantity(item: MenuItem) {
    if ((item.quantity || 0) <= 0) return;
    item.quantity = item.quantity - 1;
    this.cartService.addToCart(item, -1);
  }
}
