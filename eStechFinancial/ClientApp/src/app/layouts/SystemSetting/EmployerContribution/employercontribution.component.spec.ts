import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerContributionComponent } from './employercontribution.component';

describe('EmployerContributionComponent', () => {
  let component: EmployerContributionComponent;
  let fixture: ComponentFixture<EmployerContributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployerContributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
