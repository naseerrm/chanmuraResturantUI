import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../../../../core/services/firebase.service';
import { KdsOrder } from '../../../../../core/models/kds.model';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-table-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-order.component.html',
  styleUrls: ['./table-order.component.scss']
})
export class TableOrderComponent implements OnDestroy {

  orderType: string = '';
  private kdsSubscription!: Subscription;

  acTables = [
    { id: 1, name: 'AC-1', status: 'free' },
    { id: 2, name: 'AC-2', status: 'free' },
    { id: 3, name: 'AC-3', status: 'free' },
  ];

  nonAcTables = [
    { id: 4, name: 'NAC-1', status: 'free' },
    { id: 5, name: 'NAC-2', status: 'free' },
    { id: 6, name: 'NAC-3', status: 'free' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService, private cdr: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe(params => {
      this.orderType = params['type'] || 'Dine-In';
    });

    this.updateKDS();
  }

  // ---- KDS LIVE UPDATE ----
updateKDS() {
  this.kdsSubscription = this.firebaseService.getKDSItem()
    .subscribe((kds: KdsOrder[] | KdsOrder | null) => {

      if (!kds) return;
      console.log(kds);
      const kdsArray = Array.isArray(kds) ? kds : [kds];
      const occupiedTables = kdsArray
        .filter(o => o.table && o.status != "Completed")
        .map(o => o.table.trim());

      const updateTable = (tbl: any) => {
        tbl.status = occupiedTables.includes(tbl.name)
          ? 'occupied'
          : 'free';
      };

      this.acTables.forEach(updateTable);
      this.nonAcTables.forEach(updateTable);

      // 🔥 IMPORTANT — tell Angular to update the HTML
      this.cdr.detectChanges();
    });
}


  // ---- OPEN POS PAGE ----
  openPOS(table: any) {
    if (table.status === 'occupied') return; // prevent selecting occupied table

    this.router.navigate(['/dashboard/pos'], {
      queryParams: {
        table: table.name,
        type: this.orderType
      }
    });
  }

  // ---- CLEANUP ----
  ngOnDestroy() {
    if (this.kdsSubscription) this.kdsSubscription.unsubscribe();
  }
}
