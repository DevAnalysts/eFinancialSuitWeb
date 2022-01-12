import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageAllowanceComponent } from './packageallowance.component';

describe('PackageAllowanceComponent', () => {
  let component: PackageAllowanceComponent;
  let fixture: ComponentFixture<PackageAllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageAllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
