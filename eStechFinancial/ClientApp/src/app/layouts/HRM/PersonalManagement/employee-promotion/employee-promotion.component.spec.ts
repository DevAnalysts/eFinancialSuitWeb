import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePromotionComponent } from './employee-promotion.component';

describe('EmployeePromotionComponent', () => {
  let component: EmployeePromotionComponent;
  let fixture: ComponentFixture<EmployeePromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
