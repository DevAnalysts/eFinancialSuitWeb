import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReviewComponent } from './salary-review.component';

describe('SalaryReviewComponent', () => {
  let component: SalaryReviewComponent;
  let fixture: ComponentFixture<SalaryReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
