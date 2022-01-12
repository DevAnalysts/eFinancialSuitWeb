import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyVahicleRoutComponent } from './daily-vahicle-rout.component';

describe('DailyVahicleRoutComponent', () => {
  let component: DailyVahicleRoutComponent;
  let fixture: ComponentFixture<DailyVahicleRoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyVahicleRoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyVahicleRoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
