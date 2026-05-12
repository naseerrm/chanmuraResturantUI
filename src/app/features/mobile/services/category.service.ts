import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  companyId = 'COMP001';

  constructor(private fs: Firestore) {}

  getCategories() {
    const ref = collection(this.fs, `Companies/${this.companyId}/Categories`);
    return collectionData(ref, { idField: 'id' });
  }

  addCategory(name: string) {
    const ref = collection(this.fs, `Companies/${this.companyId}/Categories`);
    return addDoc(ref, { name });
  }

  updateCategory(id: string, name: string) {
    const ref = doc(this.fs, `Companies/${this.companyId}/Categories/${id}`);
    return updateDoc(ref, { name });
  }

  deleteCategory(id: string) {
    const ref = doc(this.fs, `Companies/${this.companyId}/Categories/${id}`);
    return deleteDoc(ref);
  }
}
