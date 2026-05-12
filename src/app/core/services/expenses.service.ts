import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Observable, of } from 'rxjs';
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
import { Expenses } from '../models/expenses.model';
import { FirebaseService } from './firebase.service';


@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private firebase: FirebaseService) {}

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

   getExpensesByDate(date?: string): Observable<any[]> {
    const dateKey = date || new Date().toISOString().split('T')[0];
    const colRef = collection(this.firebase.db, `expenses/${dateKey}/entries`);
    return collectionData(colRef, { idField: 'id' }) as Observable<any[]>;
  }

   async addExpense(expensesItem: Expenses) {
    const date = this.formatDate(expensesItem.createdAt);
    const colRef = collection(this.firebase.db, `expenses/${date}/entries`);
    const id = Date.now().toString(); // your custom ID

    // Use setDoc with a doc reference to set a custom ID
    await setDoc(doc(colRef, id), expensesItem);
  }

  async updateExpense(date: string, id: string, data: any) {
    await updateDoc(doc(this.firebase.db, `expenses/${date}/entries/${id}`), data);
  }

  async deleteExpense(date: string, id: string) {
    await deleteDoc(doc(this.firebase.db, `expenses/${date}/entries/${id}`));
  }
}
