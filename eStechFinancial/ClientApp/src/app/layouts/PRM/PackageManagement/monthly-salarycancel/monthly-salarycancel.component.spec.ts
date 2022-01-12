import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalaryCancelComponent } from './monthly-salarycancel.component';

describe('MonthlySalaryCancelComponent', () => {
  let component: MonthlySalaryCancelComponent;
  let fixture: ComponentFixture<MonthlySalaryCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlySalaryCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySalaryCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
