import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherPostingComponent } from './voucher-posting.component';

describe('VoucherPostingComponent', () => {
  let component: VoucherPostingComponent;
  let fixture: ComponentFixture<VoucherPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
