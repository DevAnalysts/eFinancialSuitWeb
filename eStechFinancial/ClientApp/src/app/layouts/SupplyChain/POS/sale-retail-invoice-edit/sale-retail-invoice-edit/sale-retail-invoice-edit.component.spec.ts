import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleRetailInvoiceEditComponent } from './sale-retail-invoice-edit.component';

describe('SaleRetailInvoiceEditComponent', () => {
  let component: SaleRetailInvoiceEditComponent;
  let fixture: ComponentFixture<SaleRetailInvoiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleRetailInvoiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleRetailInvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
