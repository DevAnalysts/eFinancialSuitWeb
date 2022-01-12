import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyChainReportsComponent } from './supply-chain-reports.component';

describe('SupplyChainReportsComponent', () => {
  let component: SupplyChainReportsComponent;
  let fixture: ComponentFixture<SupplyChainReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyChainReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyChainReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
