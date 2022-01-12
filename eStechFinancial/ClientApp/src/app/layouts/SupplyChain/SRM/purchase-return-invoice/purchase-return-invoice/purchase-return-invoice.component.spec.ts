import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnInvoiceComponent } from './purchase-return-invoice.component';

describe('PurchaseReturnInvoiceComponent', () => {
  let component: PurchaseReturnInvoiceComponent;
  let fixture: ComponentFixture<PurchaseReturnInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReturnInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReturnInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
