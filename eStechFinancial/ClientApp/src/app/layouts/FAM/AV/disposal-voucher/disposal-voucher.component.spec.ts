import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalVoucherComponent } from './disposal-voucher.component';

describe('DisposalVoucherComponent', () => {
  let component: DisposalVoucherComponent;
  let fixture: ComponentFixture<DisposalVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisposalVoucherComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
