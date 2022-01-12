import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherHistoryComponent } from './voucher-history.component';

describe('VoucherHistoryComponent', () => {
  let component: VoucherHistoryComponent;
  let fixture: ComponentFixture<VoucherHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
