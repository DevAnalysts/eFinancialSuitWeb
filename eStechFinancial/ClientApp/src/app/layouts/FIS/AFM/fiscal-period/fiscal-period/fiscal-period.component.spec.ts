import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalPeriodComponent } from './fiscal-period.component';

describe('FiscalPeriodComponent', () => {
  let component: FiscalPeriodComponent;
  let fixture: ComponentFixture<FiscalPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiscalPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
