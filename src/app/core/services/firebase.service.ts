import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Observable } from 'rxjs';
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

import {
  getStorage
} from 'firebase/storage';
import type { CollectionReference as FirestoreCollectionReference } from 'firebase/firestore';
import { RestaurantContextService } from '../../features/restaurant-context.service';
import { KdsOrder } from '../models/kds.model';

// -----------------------
// 🔥 Correct Firebase Config
// -----------------------
// -----------------------
const firebaseConfig = {
  apiKey: "AIzaSyBVEG3n4-C4FVtbJ9Q1giz24zN9qOkIK2Q",
  authDomain: "chanmurarestaurantui.firebaseapp.com",
  projectId: "chanmurarestaurantui",
  storageBucket: "chanmurarestaurantui.appspot.com", // ✅ FIXED
  messagingSenderId: "31518285804",
  appId: "1:31518285804:web:5a2c2d2e146987d533eac9"
};

const app = initializeApp(firebaseConfig);
 db: Firestore;
const storage = getStorage(app);

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  db: any;
 companyId: string = '';
  constructor( private restaurantContext: RestaurantContextService ) { 
    this.db = getFirestore(app);
    this.restaurantContext.userDetail$.subscribe(async (user) => {
      if (!user) return;

      this.companyId = user.companyId;
    });
  }


  // async addMenuItem(menuItem: any): Promise<void> {
  //   await addDoc(collection(this.db, 'menuItems'), menuItem);
  // }

   async addKDSItem( KDSOrder: KdsOrder): Promise<void> {
    await addDoc(collection(this.db, `companies/${this.companyId}/kds`), KDSOrder);
  }

   async updateKDSItem(id: string, KDSOrder: any): Promise<void> {
    await updateDoc(doc(this.db, `companies/${this.companyId}/kds`, id), KDSOrder);
  }

    async deleteKDSItem(id: string): Promise<void> {
    await deleteDoc(doc(this.db, `companies/${this.companyId}/kds`, id));
  }

  getKDSItem(): Observable<KdsOrder[]> {
  const kdsRef = collection(this.db, `companies/${this.companyId}/kds`);
  return collectionData(kdsRef, { idField: 'id' }) as Observable<KdsOrder[]>;
}

   async addMenuItem(companyId: string, menuItem: any): Promise<void> {
    await addDoc(collection(this.db, `companies/${companyId}/menuItems`), menuItem);
  }

  async addExpense(companyId : string,expenses: any): Promise<void>  {
    const id = Date.now().toString();
    await addDoc(collection(this.db, `companies/${companyId}/expenses/${expenses.createdAt}/entries/${id}`), expenses);
  }

  async getMenuItems(companyId: string): Promise<any[]> {
    const snapshot = await getDocs(collection(this.db, `companies/${companyId}/menuItems`));

    return snapshot.docs.map((d: { id: any; data: () => any; }) => ({
      id: d.id,
      ...d.data()
    }));
  }

  async updateMenuItem(companyId: string ,id: string, data: any): Promise<void> {
    await updateDoc(doc(this.db, `companies/${companyId}/menuItems`, id), data);
  }

  async deleteMenuItem(companyId: string ,id: string): Promise<void> {
    await deleteDoc(doc(this.db, `companies/${companyId}/menuItems`, id));
  }

  async getLastMonthStats(): Promise<any> {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const docId = `${year}-${String(lastMonth).padStart(2,'0')}`;
  const itemRef = doc(this.db, 'analytics', docId);
  const snap = await getDoc(itemRef);

  if (!snap.exists()) return { daily: {}, totalRevenue: 0 };
  return snap.data();
}

// -----------------------
// Daily sales & order helpers
// -----------------------

/**
 * Build ISO date string like "2025-11-28"
 */
private getDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}
/**
 * Path helpers:
 * - Counter doc path: sales-counters/{YYYY-MM-DD}
 * - Orders collection path: sales/{YYYY-MM-DD}/orders
 */
private getCounterDocRef(dateKey: string) {
  return doc(this.db, `companies/${this.companyId}/sales-counters`, dateKey);
}


async placeOrderAtomic(orderData: any): Promise<{ orderId: number; docId: string }> {
  const dateKey = this.getDateKey();
  const counterRef = this.getCounterDocRef(dateKey);
  const ordersCollRef = this.getOrdersCollectionRef(dateKey);
 let orderValue : number = 0;
const result = await runTransaction(this.db, async (transaction: any) => {

    // 1) read counter
    const counterSnap = await transaction.get(counterRef);
    let next = 1;
    if (!counterSnap.exists()) {
      // create counter doc with count = 1
      transaction.set(counterRef, { count: 1, updatedAt: serverTimestamp() });
      next = 1;
    } else {
      const data = counterSnap.data() as any;
      const current = data.count || 0;
      next = current + 1;
      transaction.update(counterRef, { count: next, updatedAt: serverTimestamp() });
    }

    // 2) create order doc with generated orderId
    const orderDocRef = doc(ordersCollRef); // auto doc id
    const payload = {
      orderId: next,
      ...orderData,
      totalAmount: Number(orderData.totalAmount || 0),
      createdAt: serverTimestamp()
    };
orderValue = next
    transaction.set(orderDocRef, payload);

    // return both values from transaction
    return { orderId: next, docId: orderDocRef.id };
  });

  // // Open WhatsApp link in new tab/window
  // window.open(whatsappUrl, '_blank');

// Assuming `orderData` contains the order details and `phoneNumber` is the recipient's phone number.
// const restaurantName = "Naveen's Delhi Malai Chapp";
// const whtsappOrderData = {
//  Items : [...orderData.items],
//  CustomerName: orderData.purchaserName,
//   MobileNumber: orderData.mobileNumber,
//   TotalAmount: orderData.totalAmount
// };


// // Format the items into a string for the WhatsApp message
// const formattedItems = whtsappOrderData.Items
//   .map((item: { name: any; quantity: any; totalPrice: any; }) => `${item.name} x${item.quantity} - ₹${item.totalPrice}`)
//   .join("\n");

// // Format the message
// const message = encodeURIComponent(`
// New Order from ${restaurantName} #${orderValue}
// Items:
// ${formattedItems}
// Total: ₹${orderData.totalAmount}`);

// // Construct the WhatsApp URL
// const whatsappUrl = `https://wa.me/${orderData.mobileNumber}?text=${message}`;

//  // IMPORTANT — works on mobile browsers
//   window.location.href = whatsappUrl;


  return result;
}


/**
 * Live subscription to today's orders.
 * onChange is called with array of docs every time there is an update.
 * Returns unsubscribe() function.
 *
 * Example usage:
 * const unsub = firebaseService.subscribeTodayOrders((arr)=>{ ... });
 * unsub(); // when component destroyed
 */
subscribeTodayOrders(onChange: (orders: any[]) => void) {
  const dateKey = this.getDateKey();
  const ordersCollRef = this.getOrdersCollectionRef(dateKey);
  const q = query(ordersCollRef, orderBy('createdAt', 'desc'));

  const unsub = onSnapshot(q, (snap: { docs: any[]; }) => {
    const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    onChange(arr);
  }, (err: any) => {
    console.error('subscribeTodayOrders error', err);
    onChange([]);
  });

  return unsub;
}


/**
 * Safely read the current counter for date (useful for admin)
 */
async getTodayCounter(): Promise<number> {
  const dateKey = this.getDateKey();
  const counterSnap = await getDoc(this.getCounterDocRef(dateKey));
  if (!counterSnap.exists()) return 0;
  const data = counterSnap.data() as any;
  return Number(data.count || 0);
}

// async getOrderbyDate(selectedDate?: string): Promise<any[]> {
//   const dateKey = selectedDate || this.getDateKey();
//   const ordersCollRef = this.getOrdersCollectionRef(dateKey);
//   const snapshot = await getDocs(ordersCollRef);
//   return snapshot.docs.map((d: { id: any; data: () => any; }) => ({
//     id: d.id,
//     ...d.data()
//   }));
  getOrderbyDate(selectedDate?: string): Observable<any[]> {
    const dateKey = selectedDate || this.getDateKey();
    const ordersCollRef = this.getOrdersCollectionRef(dateKey);

    // collectionData returns an Observable, Angular auto-detects changes
    return collectionData(ordersCollRef, { idField: 'id' });
  }

  private getOrdersCollectionRef(dateKey: string) {
  return collection(this.db, `companies/${this.companyId}/sales/${dateKey}/orders`);
}

}
