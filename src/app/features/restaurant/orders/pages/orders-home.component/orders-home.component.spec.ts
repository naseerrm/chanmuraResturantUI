import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersHomeComponent } from './orders-home.component';

describe('OrdersHomeComponent', () => {
  let component: OrdersHomeComponent;
  let fixture: ComponentFixture<OrdersHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
