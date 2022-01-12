import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxClaimComponent } from './tax-claim.component';

describe('TaxClaimComponent', () => {
  let component: TaxClaimComponent;
  let fixture: ComponentFixture<TaxClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaxClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
