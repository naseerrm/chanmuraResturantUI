import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../core/models/menu-item.model';
import { CartService } from '../../core/services/cart.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {
  menuItems: MenuItem[] = [
   { id: 1, name: 'Paneer Tikka',imageUrl:'pannertikka.jpeg', description: 'Spicy paneer', price: 180, category: 'Veg', isAvailable: true ,quantity:0,quantityAvailable:10},
      { id: 2, name: 'Chicken Tikka',imageUrl:'chickentikka.jpeg', description: 'Grilled chicken', price: 250, category: 'Non-Veg', isAvailable: true,quantity:0,quantityAvailable:1},
      { id: 3, name: 'Veg Biryani',imageUrl:'vegbiriyani.jpg', description: 'Delicious biryani', price: 150, category: 'Veg', isAvailable: true,quantity:0,quantityAvailable:1 }
    ];
    
  private sub?: Subscription;
  constructor(private cartService: CartService, private firebaseService: FirebaseService  ) {}

  
   loadMenuItems() {
    this.firebaseService.getMenuItems().subscribe(items => {
      this.menuItems = items;
    });
  }

increaseQuantity(item: MenuItem) {
  item.quantity = (item.quantity || 0) + 1;
  this.cartService.addToCart(item, 1); // Pass the MenuItem object
}


decreaseQuantity(item: MenuItem) {
  if ((item.quantity || 0) <= 0) return;
  item.quantity = item.quantity - 1;
  this.cartService.addToCart(item, -1); // Pass the MenuItem object
}

}
