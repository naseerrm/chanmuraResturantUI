import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc,serverTimestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private fs: Firestore) {}

   async getUserdetails(uid: string) {
    const snap = await getDoc(doc(this.fs, `users/${uid}`));
    return snap.exists() ? (snap.data() as any) : null;
  }

  async getCompany(companyCode: string) {
    const snap = await getDoc(doc(this.fs, `companies/${companyCode}`));
    return snap.exists() ? (snap.data() as any) : null;
  }

  async createCompany(companyCode: string, payload: any) {
    const ref = doc(this.fs, `companies/${companyCode}`);
    const snap = await getDoc(ref);
    if (snap.exists()) throw new Error('Company already exists');
    await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
  }

  async updateCompany(companyCode: string, payload: any) {
    const ref = doc(this.fs, `companies/${companyCode}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { ...payload, updatedAt: serverTimestamp() });
    } else {
      await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
    }
  }
}
