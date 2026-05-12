import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderComponent } from './customerorder';

describe('Customerorder', () => {
  let component: CustomerOrderComponent;
  let fixture: ComponentFixture<CustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
