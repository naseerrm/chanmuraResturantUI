import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KdsComponent } from './kds.component';

describe('KdsComponent', () => {
  let component: KdsComponent;
  let fixture: ComponentFixture<KdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KdsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
