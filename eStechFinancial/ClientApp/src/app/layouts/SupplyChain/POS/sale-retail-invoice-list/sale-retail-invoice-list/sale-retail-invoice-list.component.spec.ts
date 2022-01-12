import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleRetailInvoiceListComponent } from './sale-retail-invoice-list.component';


describe('SaleRetailInvoiceListComponent', () => {
  let component: SaleRetailInvoiceListComponent;
  let fixture: ComponentFixture<SaleRetailInvoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleRetailInvoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleRetailInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
