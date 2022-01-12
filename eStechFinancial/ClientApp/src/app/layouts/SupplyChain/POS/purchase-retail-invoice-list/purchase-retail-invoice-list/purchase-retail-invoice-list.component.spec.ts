import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRetailInvoiceListComponent } from './purchase-retail-invoice-list.component';

describe('PurchaseRetailInvoiceListComponent', () => {
  let component: PurchaseRetailInvoiceListComponent;
  let fixture: ComponentFixture<PurchaseRetailInvoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRetailInvoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRetailInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
