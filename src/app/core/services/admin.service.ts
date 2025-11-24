import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private menuItems = signal<MenuItem[]>([]);

  getMenuItems() {
    return this.menuItems;
  }

  addMenuItem(item: MenuItem) {
    const items = this.menuItems();
    item.id = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    this.menuItems.set([...items, item]);
  }

  updateMenuItemQuantity(id: number, quantity: number) {
    const items = this.menuItems();
    const index = items.findIndex(i => i.id === id);
    if (index >= 0) {
      items[index].quantityAvailable = quantity;
      this.menuItems.set([...items]);
    }
  }

  decreaseQuantity(id: number, purchased: number) {
    const items = this.menuItems();
    const index = items.findIndex(i => i.id === id);
    if (index >= 0) {
      items[index].quantityAvailable -= purchased;
      if (items[index].quantityAvailable < 0) items[index].quantityAvailable = 0;
      this.menuItems.set([...items]);
    }
  }
}
