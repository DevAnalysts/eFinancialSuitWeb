import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeTaxYearComponent } from './incometax-year.component';

describe('IncomeTaxYearComponent', () => {
  let component: IncomeTaxYearComponent;
  let fixture: ComponentFixture<IncomeTaxYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeTaxYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTaxYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
