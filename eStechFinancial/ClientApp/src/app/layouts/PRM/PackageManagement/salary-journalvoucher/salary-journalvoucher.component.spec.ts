import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryJournalVoucherComponent } from './salary-journalvoucher.component';

describe('SalaryJournalVoucherComponent', () => {
  let component: SalaryJournalVoucherComponent;
  let fixture: ComponentFixture<SalaryJournalVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryJournalVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
