import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalaryStopComponent } from './monthly-salarystop.component';

describe('MonthlySalaryStopComponent', () => {
  let component: MonthlySalaryStopComponent;
  let fixture: ComponentFixture<MonthlySalaryStopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlySalaryStopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySalaryStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
