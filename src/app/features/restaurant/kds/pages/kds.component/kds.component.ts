import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../../../../core/services/firebase.service';
import { KdsItem, KdsOrder } from '../../../../../core/models/kds.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillSummaryComponent } from '../../../../../shared/components/bill-summary/bill-summary';
import { CartItem } from '../../../../../core/services/cart.service';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-kds',
  imports: [CommonModule, FormsModule, BillSummaryComponent],
  templateUrl: './kds.component.html',
  styleUrls: ['./kds.component.scss']
})
export class KdsComponent implements OnInit, OnDestroy {

  kdsOrders: KdsOrder[] = [];
  upiQrCode = '';

  @ViewChild(BillSummaryComponent) billSummary!: BillSummaryComponent;
  cartItems: CartItem[] = [];

  private destroy$ = new Subject<void>();
  private debug = false; // turn ON if needed

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateKDS();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleOrderConfirmed(event: any) {
    if (this.debug) console.log('Order confirmed:', event);
  }

  updateKDS() {
    this.firebaseService
      .getKDSItem()
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((kds: KdsOrder[] | KdsOrder | null) => {
        if (!kds) return;

        if (this.debug) console.log('🔥 KDS Update Received:', kds);

        const ordersArray = Array.isArray(kds) ? kds : [kds];

        this.kdsOrders = ordersArray
          .filter(o => o.status !== 'Completed')
          .map(order => ({
            ...order,
            startTime: order.startTime ?? new Date().toISOString(),
            items: order.items.map((item: KdsItem) => ({
              ...item,
              menuItem: {
                ...item.menuItem,
                id: item.menuItem.id ?? 'unknown-id'
              },
              displayName: item.menuItem.name,
              qty: item.quantity,
              itemStatus: item.itemStatus ?? 'pending'
            }))
          }));

        this.cdr.detectChanges();
      });
  }

  /**
   * Update status of a KDS item and optionally sync to Firebase
   */
  updateItemStatus(order: KdsOrder, item: KdsItem): void {
    // Example: update in local state
    const targetOrder = this.kdsOrders.find(o => o.table === order.table);
    if (!targetOrder) return;

    const targetItem = targetOrder.items.find(i => i.menuItem.id === item.menuItem.id);
    if (!targetItem) return;

    targetItem.itemStatus = item.itemStatus;

    // TODO: Update in Firebase
    // this.firebaseService.updateKDSItemStatus(order.id, item.menuItem.id, item.itemStatus);
  }

  
 markOrderReady(order: any) {
    order.items.forEach((i: { itemStatus: string; }) => i.itemStatus = 'ready');
      order.status = "ready";
    this.firebaseService.updateKDSItem(order.id , order);
    console.log(`Order for table ${order.table} marked READY`);
  }

  TakeBill(order: any) {
     order.items.forEach((i: { itemStatus: string; }) => i.itemStatus = 'Completed');
     order.status = "Completed";
     order.EndTime = new Date().toISOString();
    this.firebaseService.updateKDSItem(order.id ,order);
    console.log(`Order for table ${order.table} Completed`);
    
    this.cartItems.push(order.items[0]);
    console.log(this.cartItems);
    this.billSummary.checkout();
  }


}
