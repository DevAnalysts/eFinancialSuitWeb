import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOpeningBalanceComponent } from './stock-opening-balance.component';

describe('StockOpeningBalanceComponent', () => {
  let component: StockOpeningBalanceComponent;
  let fixture: ComponentFixture<StockOpeningBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOpeningBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOpeningBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
