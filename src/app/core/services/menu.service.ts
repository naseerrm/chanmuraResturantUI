import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private menu: MenuItem[] = [
    { id: 1, name: 'Paneer Tikka',imageUrl:'pannertikka.jpeg', description: 'Spicy Paneer', price: 250, category: 'Starters', isAvailable: true,quantity:0,quantityAvailable:1 },
    { id: 2, name: 'Butter Chicken',imageUrl:'butterChicken.png', description: 'Creamy Chicken Curry', price: 350, category: 'Main Course', isAvailable: true,quantity:0 ,quantityAvailable:1 }
  ];

  getMenuItems(): Observable<MenuItem[]> {
    return of(this.menu);
  }
}
