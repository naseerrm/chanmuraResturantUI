import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, CollectionReference } from '@angular/fire/firestore';
import { MenuItem } from '../models/menu-item.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  // Get all menu items
  getMenuItems(): Observable<MenuItem[]> {
    // Use AngularFire collection() function
    const col: CollectionReference<MenuItem> = collection(this.firestore, 'menu') as CollectionReference<MenuItem>;
    return collectionData(col, { idField: 'id' }) as Observable<MenuItem[]>;
  }

  // Add new menu item
  addMenuItem(item: MenuItem) {
    const col: CollectionReference<MenuItem> = collection(this.firestore, 'menu') as CollectionReference<MenuItem>;
    return addDoc(col, item);
  }
}
