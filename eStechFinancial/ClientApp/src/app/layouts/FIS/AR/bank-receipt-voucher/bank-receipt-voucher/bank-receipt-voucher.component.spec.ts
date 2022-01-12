import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReceiptVoucherComponent } from './bank-receipt-voucher.component';

describe('BankReceiptVoucherComponent', () => {
  let component: BankReceiptVoucherComponent;
  let fixture: ComponentFixture<BankReceiptVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankReceiptVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankReceiptVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
