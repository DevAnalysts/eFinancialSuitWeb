import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationVoucherComponent } from './depreciation-voucher.component';

describe('DepreciationVoucherComponent', () => {
  let component: DepreciationVoucherComponent;
  let fixture: ComponentFixture<DepreciationVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepreciationVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
