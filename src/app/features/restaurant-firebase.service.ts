import { Firestore } from '@angular/fire/firestore';
import {
  collection,
  getFirestore,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  runTransaction,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  DocumentData,
  CollectionReference
} from 'firebase/firestore';

import { AuthService } from '../core/services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ResturantFirebaseService {

    constructor(private auth: AuthService, private fs: Firestore) {
        this.auth.getCurrentUid
    }
    
 // -----------------------
  // Menu Items (Company-scoped)
  // -----------------------
  async addMenuItem(companyId: string, menuItem: any): Promise<void> {
    await addDoc(collection(this.fs, `companies/${companyId}/menuItems`), menuItem);
  }

  async getMenuItems(companyId: string): Promise<any[]> {
    const snapshot = await getDocs(collection(this.fs, `companies/${companyId}/menuItems`));
    return snapshot.docs.map((d: { id: any; data: () => any; }) => ({ id: d.id, ...d.data() }));
  }

  async updateMenuItem(companyId: string, id: string, data: any): Promise<void> {
    await updateDoc(doc(this.fs, `companies/${companyId}/menuItems/${id}`), data);
  }

  async deleteMenuItem(companyId: string, id: string): Promise<void> {
    await deleteDoc(doc(this.fs, `companies/${companyId}/menuItems/${id}`));
  }

  // -----------------------
  // Sales / Orders (Company-scoped)
  // -----------------------
  private getOrdersCollectionRef(companyId: string, dateKey: string) {
    return collection(this.fs, `companies/${companyId}/sales/${dateKey}/orders`);
  }

  async placeOrderAtomic(companyId: string, orderData: any): Promise<{ orderId: number; docId: string }> {
    const dateKey = new Date().toISOString().split('T')[0];
    const counterRef = doc(this.fs, `companies/${companyId}/sales-counters/${dateKey}`);
    const ordersCollRef = this.getOrdersCollectionRef(companyId, dateKey);

    const result = await runTransaction(this.fs, async (transaction: { get: (arg0: any) => any; set: (arg0: any, arg1: { count: number; updatedAt: any; }) => void; update: (arg0: any, arg1: { count: number; updatedAt: any; }) => void; }) => {
      const counterSnap = await transaction.get(counterRef);
      let next = 1;
      if (!counterSnap.exists()) {
        transaction.set(counterRef, { count: 1, updatedAt: serverTimestamp() });
      } else {
        const current = counterSnap.data()?.count || 0;
        next = current + 1;
        transaction.update(counterRef, { count: next, updatedAt: serverTimestamp() });
      }

      const orderDocRef = doc(ordersCollRef);
      transaction.set(orderDocRef, { orderId: next, ...orderData, createdAt: serverTimestamp() });
      return { orderId: next, docId: orderDocRef.id };
    });

    return result;
  }

  subscribeTodayOrders(companyId: string, onChange: (orders: any[]) => void) {
    const dateKey = new Date().toISOString().split('T')[0];
    const ordersCollRef = this.getOrdersCollectionRef(companyId, dateKey);
    const q = query(ordersCollRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snap: { docs: any[]; }) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      onChange(arr);
    }, (err: any) => {
      console.error('subscribeTodayOrders error', err);
      onChange([]);
    });
  }
} 