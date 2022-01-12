import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleRetailInvoiceComponent } from './sale-retail-invoice.component';

describe('SaleRetailInvoiceComponent', () => {
  let component: SaleRetailInvoiceComponent;
  let fixture: ComponentFixture<SaleRetailInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleRetailInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleRetailInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
