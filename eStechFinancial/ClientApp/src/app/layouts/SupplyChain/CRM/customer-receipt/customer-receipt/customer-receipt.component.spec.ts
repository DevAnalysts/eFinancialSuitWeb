import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReceiptComponent } from './customer-receipt.component';

describe('CustomerReceiptComponent', () => {
  let component: CustomerReceiptComponent;
  let fixture: ComponentFixture<CustomerReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
