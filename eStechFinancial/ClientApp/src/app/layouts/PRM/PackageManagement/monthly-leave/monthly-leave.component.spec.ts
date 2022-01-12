import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyLeaveComponent } from './monthly-leave.component';

describe('MonthlyLeaveComponent', () => {
  let component: MonthlyLeaveComponent;
  let fixture: ComponentFixture<MonthlyLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
