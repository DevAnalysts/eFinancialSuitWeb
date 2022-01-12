import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnInvoiceComponent } from './sale-return-invoice.component';

describe('SaleReturnInvoiceComponent', () => {
  let component: SaleReturnInvoiceComponent;
  let fixture: ComponentFixture<SaleReturnInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReturnInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
