import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSettingComponent } from './dashsetting.component';

describe('DashSettingComponent', () => {
  let component: DashSettingComponent;
  let fixture: ComponentFixture<DashSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
