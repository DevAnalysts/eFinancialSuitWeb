import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherApprovalComponent } from './voucher-approval.component';

describe('VoucherApprovalComponent', () => {
  let component: VoucherApprovalComponent;
  let fixture: ComponentFixture<VoucherApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
