import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOffVoucherComponent } from './writeoff-voucher.component';

describe('WriteOffVoucherComponent', () => {
  let component: WriteOffVoucherComponent;
  let fixture: ComponentFixture<WriteOffVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WriteOffVoucherComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOffVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
