import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPackageComponent } from './salary-package.component';

describe('SalaryPackageComponent', () => {
  let component: SalaryPackageComponent;
  let fixture: ComponentFixture<SalaryPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
