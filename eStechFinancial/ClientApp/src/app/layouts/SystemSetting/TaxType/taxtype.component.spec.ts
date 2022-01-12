import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxTypeComponent } from './taxtype.component';

describe('TaxTypeComponent', () => {
  let component: TaxTypeComponent;
  let fixture: ComponentFixture<TaxTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaxTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
