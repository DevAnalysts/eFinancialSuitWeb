import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRenewalComponent } from './employee-renewal.component';

describe('EmployeeRenewalComponent', () => {
  let component: EmployeeRenewalComponent;
  let fixture: ComponentFixture<EmployeeRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
