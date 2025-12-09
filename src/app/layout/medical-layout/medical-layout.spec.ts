import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalLayout } from './medical-layout';

describe('MedicalLayout', () => {
  let component: MedicalLayout;
  let fixture: ComponentFixture<MedicalLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
