import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerReceiptImportComponent } from './customer-receipt-import.component';

describe('CustomerReceiptImportComponent', () => {
  let component: CustomerReceiptImportComponent;
  let fixture: ComponentFixture<CustomerReceiptImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerReceiptImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReceiptImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
