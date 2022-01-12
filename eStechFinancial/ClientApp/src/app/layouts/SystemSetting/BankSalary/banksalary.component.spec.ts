import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSalaryComponent } from './banksalary.component';

describe('BankSalaryComponent', () => {
  let component: BankSalaryComponent;
  let fixture: ComponentFixture<BankSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BankSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
