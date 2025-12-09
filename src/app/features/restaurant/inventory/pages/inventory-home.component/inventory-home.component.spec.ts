import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryHomeComponent } from './inventory-home.component';

describe('InventoryHomeComponent', () => {
  let component: InventoryHomeComponent;
  let fixture: ComponentFixture<InventoryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
