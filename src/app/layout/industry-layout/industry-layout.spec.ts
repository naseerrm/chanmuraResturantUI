import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryLayout } from './industry-layout';

describe('IndustryLayout', () => {
  let component: IndustryLayout;
  let fixture: ComponentFixture<IndustryLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustryLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustryLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
