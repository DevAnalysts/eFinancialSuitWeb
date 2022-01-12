import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRetialInvoiceComponent } from './purchase-retail-invoice.component';

describe('PurchaseRetialInvoiceComponent', () => {
  let component: PurchaseRetialInvoiceComponent;
  let fixture: ComponentFixture<PurchaseRetialInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseRetialInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRetialInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
