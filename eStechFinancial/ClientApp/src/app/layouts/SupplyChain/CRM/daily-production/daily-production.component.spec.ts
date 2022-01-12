import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyProductionComponent } from './daily-production.component';

describe('DailyProductionComponent', () => {
  let component: DailyProductionComponent;
  let fixture: ComponentFixture<DailyProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
