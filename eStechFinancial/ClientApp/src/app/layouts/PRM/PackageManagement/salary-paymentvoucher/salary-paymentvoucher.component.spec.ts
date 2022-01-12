import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPaymentVoucherComponent } from './salary-paymentvoucher.component';

describe('SalaryPaymentVoucherComponent', () => {
  let component: SalaryPaymentVoucherComponent;
  let fixture: ComponentFixture<SalaryPaymentVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryPaymentVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryPaymentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
