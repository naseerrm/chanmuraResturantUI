import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSummary } from './bill-summary';

describe('BillSummary', () => {
  let component: BillSummary;
  let fixture: ComponentFixture<BillSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
