import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRetialInvoiceEditComponent } from './purchase-retail-invoice-edit.component';

describe('PurchaseRetialInvoiceEditComponent', () => {
  let component: PurchaseRetialInvoiceEditComponent;
  let fixture: ComponentFixture<PurchaseRetialInvoiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseRetialInvoiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRetialInvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
