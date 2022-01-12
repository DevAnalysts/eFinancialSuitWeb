import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationEmpComponent } from './evaluation-emp.component';

describe('EvaluationEmpComponent', () => {
  let component: EvaluationEmpComponent;
  let fixture: ComponentFixture<EvaluationEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
