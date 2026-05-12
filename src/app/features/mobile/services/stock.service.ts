import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class StockService {

  companyId = 'COMP001';

  constructor(private fs: Firestore) {}

  addStockMovement(stock: any) {
    const id = crypto.randomUUID();
    const ref = doc(collection(
      this.fs, `Companies/${this.companyId}/StockMovement`
    ));
    stock.movementId = id;
    return setDoc(ref, stock);
  }
}
