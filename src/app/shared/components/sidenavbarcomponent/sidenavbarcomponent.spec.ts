import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidenavbarcomponent } from './sidenavbarcomponent';

describe('Sidenavbarcomponent', () => {
  let component: Sidenavbarcomponent;
  let fixture: ComponentFixture<Sidenavbarcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidenavbarcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidenavbarcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
