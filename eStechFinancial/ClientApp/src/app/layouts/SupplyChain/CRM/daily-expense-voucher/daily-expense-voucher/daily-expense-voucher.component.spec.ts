import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyExpenseVoucherComponent } from './daily-expense-voucher.component';

describe('DailyExpenseVoucherComponent', () => {
  let component: DailyExpenseVoucherComponent;
  let fixture: ComponentFixture<DailyExpenseVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyExpenseVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyExpenseVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
