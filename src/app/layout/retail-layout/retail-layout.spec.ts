import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailLayout } from './retail-layout';

describe('RetailLayout', () => {
  let component: RetailLayout;
  let fixture: ComponentFixture<RetailLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
