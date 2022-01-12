import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationGroupComponent } from './evaluation-group.component';

describe('EvaluationGroupComponent', () => {
  let component: EvaluationGroupComponent;
  let fixture: ComponentFixture<EvaluationGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
