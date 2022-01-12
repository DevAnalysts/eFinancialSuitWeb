import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceDayWiseComponent } from './sale-invoice-day.component';

describe('SaleInvoiceDayWiseComponent', () => {
  let component: SaleInvoiceDayWiseComponent;
  let fixture: ComponentFixture<SaleInvoiceDayWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaleInvoiceDayWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleInvoiceDayWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
