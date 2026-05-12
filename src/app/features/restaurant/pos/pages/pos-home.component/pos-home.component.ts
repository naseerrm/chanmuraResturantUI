import { Component, signal, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RestaurantContextService } from '../../../../restaurant-context.service';
import { FirebaseService } from '../../../../../core/services/firebase.service';
import { CartItem, CartService } from '../../../../../core/services/cart.service';
import { MenuItem } from '../../../../../core/models/menu-item.model';
import { serverTimestamp } from '@angular/fire/firestore';
import { KdsItem, KdsOrder } from '../../../../../core/models/kds.model';

@Component({
  selector: 'app-pos-home',
  templateUrl: './pos-home.component.html',
  styleUrls: ['./pos-home.component.scss'], // FIXED typo
  imports: [CommonModule, FormsModule],
})
export class PosHomeComponent implements OnInit, AfterViewInit {

  companyId: string = '';
  isLoading = true;

  menuItems = signal<MenuItem[]>([]);
  cartItems: CartItem[] = [];
  cartItemCount = 0;

  // Filters
  searchText = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOrder = '';
  availabilityFilter = '';
  tableNumber: string = '';
  selectedOrder: string = ''; // current selection

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;

  constructor(
    private router: Router,
    private cartService: CartService,
    private firebaseService: FirebaseService,
    private restaurantContext: RestaurantContextService,
    private route : ActivatedRoute
  ) {}

  // ----------------------------
  //  INIT
  // ----------------------------
  async ngOnInit() {
    this.restaurantContext.userDetail$.subscribe(async (user) => {
      if (!user) return;

      this.companyId = user.companyId;

      const menu = await this.firebaseService.getMenuItems(this.companyId);
      this.menuItems.set(menu);

      this.initializeCartSync(menu);
    });
  }

  // ----------------------------
  //  AFTER VIEW INIT (Ripple Setup)
  // ----------------------------
  ngAfterViewInit(): void {
    this.setupRipples();
  }

  selectOrder(order: string) {
  this.selectedOrder = order;
  // // You can still call your previous functions if needed
  // if (order === 'dine') this.goToDineIn();
  // else if (order === 'delivery') this.goToDelivery();
  // else if (order === 'pickup') this.goToPickup();
}

  private setupRipples() {
    const elements = document.querySelectorAll<HTMLElement>('.ripple-target');
    elements.forEach(el => {
      el.addEventListener('click', (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
      });
    });
  }

  // ----------------------------
  //  CART SYNC
  // ----------------------------
  initializeCartSync(menu: MenuItem[]) {
    this.cartService.cartItems$.subscribe((cartItems) => {
      this.cartItems = cartItems;

      this.cartItemCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const updatedMenu = menu.map((m) => {
        const cartItem = cartItems.find((c) => c.menuItem.id === m.id);
        return {
          ...m,
          quantity: cartItem ? cartItem.quantity : 0,
        };
      });

      this.menuItems.set(updatedMenu);
      this.isLoading = false;
    });
  }

  // ----------------------------
  //  FILTERS + SORT
  // ----------------------------
  filteredMenuItems() {
    let items = [...this.menuItems()];

    if (this.searchText.trim()) {
      const s = this.searchText.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(s));
    }

    if (this.selectedCategory) {
      items = items.filter((i) => i.category === this.selectedCategory);
    }

    if (this.minPrice !== null) {
      items = items.filter((i) => i.price >= this.minPrice!);
    }

    if (this.maxPrice !== null) {
      items = items.filter((i) => i.price <= this.maxPrice!);
    }

    if (this.availabilityFilter === 'in') {
      items = items.filter((i) => i.quantityAvailable > 0);
    } else if (this.availabilityFilter === 'out') {
      items = items.filter((i) => i.quantityAvailable === 0);
    }

    if (this.sortOrder === 'asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }

  // ----------------------------
  //  PAGINATION
  // ----------------------------
  get totalPages() {
    return Math.ceil(this.filteredMenuItems().length / this.itemsPerPage);
  }

  paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMenuItems().slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // ----------------------------
  //  CART OPERATIONS
  // ----------------------------
  increaseQuantity(item: MenuItem) {
    item.quantity = (item.quantity || 0) + 1;
    this.cartService.addToCart(item, 1);
  }

  decreaseQuantity(item: MenuItem) {
    if ((item.quantity || 0) <= 0) return;
    item.quantity -= 1;
    this.cartService.addToCart(item, -1);
  }

  // ----------------------------
  //  MISC
  // ----------------------------
  viewCart() {
    this.router.navigate(['/dashboard/cart']);
  }

  // ----------------------------
  //  MISC
  // ----------------------------
viewKDS() {
  const formattedItems: KdsItem[] = this.cartItems.map(item => ({
    menuItem: {
      ...item.menuItem,
      id: item.menuItem.id ?? 'unknown-id'
    },
    quantity: item.quantity,
    totalPrice: item.totalPrice,
    displayName: item.menuItem.name,
    itemStatus: 'pending' as 'pending'
  }));

const kdsData: Omit<KdsOrder, 'id'> = {
    table: this.tableNumber,
    items: formattedItems,
    status: 'pending',
    startTime: new Date().toISOString()
  };
console.log(kdsData);

  this.cartService.clearCart();
  this.firebaseService.addKDSItem(kdsData);
  this.router.navigate(['/dashboard/kds']);
}



  onImageError(event: any) {
    event.target.src = 'assets/default.jpg';
  }
}
