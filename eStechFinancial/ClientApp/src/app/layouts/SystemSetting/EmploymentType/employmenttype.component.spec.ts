import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentTypeComponent } from './employmenttype.component';

describe('EmploymentTypeComponent', () => {
  let component: EmploymentTypeComponent;
  let fixture: ComponentFixture<EmploymentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmploymentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
