import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherTypeComponent } from './vouchertype.component';

describe('VoucherTypeComponent', () => {
  let component: VoucherTypeComponent;
  let fixture: ComponentFixture<VoucherTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
