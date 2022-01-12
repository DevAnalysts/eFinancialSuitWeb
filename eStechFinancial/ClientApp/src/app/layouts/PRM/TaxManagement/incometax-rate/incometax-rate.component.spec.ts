import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeTaxRateComponent } from './incometax-rate.component';

describe('IncomeTaxRateComponent', () => {
  let component: IncomeTaxRateComponent;
  let fixture: ComponentFixture<IncomeTaxRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeTaxRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTaxRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
