import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCategoryComponent } from './employeecategory.component';

describe('EmployeeCategoryComponent', () => {
  let component: EmployeeCategoryComponent;
  let fixture: ComponentFixture<EmployeeCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
