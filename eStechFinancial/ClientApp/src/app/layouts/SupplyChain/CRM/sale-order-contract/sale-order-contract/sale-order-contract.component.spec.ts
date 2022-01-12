import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderContractComponent } from './sale-order-contract.component';

describe('SaleOrderContractComponent', () => {
  let component: SaleOrderContractComponent;
  let fixture: ComponentFixture<SaleOrderContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleOrderContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
