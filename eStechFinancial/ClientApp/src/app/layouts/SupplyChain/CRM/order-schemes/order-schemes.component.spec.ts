import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSchemesComponent } from './order-schemes.component';

describe('OrderSchemesComponent ', () => {
  let component: OrderSchemesComponent ;
  let fixture: ComponentFixture<OrderSchemesComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSchemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSchemesComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
