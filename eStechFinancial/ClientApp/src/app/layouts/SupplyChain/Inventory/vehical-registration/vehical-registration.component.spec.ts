import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalRegistrationComponent } from './vehical-registration.component';

describe('VehicalRegistrationComponent', () => {
  let component: VehicalRegistrationComponent;
  let fixture: ComponentFixture<VehicalRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicalRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
