import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveSettingComponent } from './leavesetting.component';

describe('LeaveTypeComponent', () => {
  let component: LeaveSettingComponent;
  let fixture: ComponentFixture<LeaveSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
