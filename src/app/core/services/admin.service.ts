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
    // compute next id as a string (existing ids may be strings)
    const nextId = items.length > 0
      ? (Math.max(...items.map(i => Number(i.id))) + 1).toString()
      : '1';
    item.id = nextId;
    this.menuItems.set([...items, item]);
  }

  updateMenuItemQuantity(id: string, quantity: number) {
    const items = this.menuItems();
    const index = items.findIndex(i => i.id === id);
    if (index >= 0) {
      items[index].quantityAvailable = quantity;
      this.menuItems.set([...items]);
    }
  }

  decreaseQuantity(id: string, purchased: number) {
    const items = this.menuItems();
    const index = items.findIndex(i => i.id === id);
    if (index >= 0) {
      items[index].quantityAvailable -= purchased;
      if (items[index].quantityAvailable < 0) items[index].quantityAvailable = 0;
      this.menuItems.set([...items]);
    }
  }
}
