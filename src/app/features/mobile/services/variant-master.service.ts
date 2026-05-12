import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class VariantMasterService {

  companyId = 'COMP001';

  constructor(private fs: Firestore) {}

  getVariants(type: string) {
    const ref = collection(this.fs,
      `Companies/${this.companyId}/VariantMasters/${type}/items`
    );
    return collectionData(ref, { idField: 'id' });
  }

  addVariant(type: string, name: string) {
    const ref = collection(this.fs,
      `Companies/${this.companyId}/VariantMasters/${type}/items`
    );
    return addDoc(ref, { name });
  }

  deleteVariant(type: string, id: string) {
    const ref = doc(this.fs,
      `Companies/${this.companyId}/VariantMasters/${type}/items/${id}`
    );
    return deleteDoc(ref);
  }
}
