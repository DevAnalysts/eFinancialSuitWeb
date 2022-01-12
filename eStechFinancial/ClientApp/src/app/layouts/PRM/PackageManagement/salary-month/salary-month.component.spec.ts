import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryMonthComponent } from './salary-month.component';

describe('SalaryMonthComponent', () => {
  let component: SalaryMonthComponent;
  let fixture: ComponentFixture<SalaryMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
