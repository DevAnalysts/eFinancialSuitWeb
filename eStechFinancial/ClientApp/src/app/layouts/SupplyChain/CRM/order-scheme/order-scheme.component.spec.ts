import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSchemeComponent } from './order-scheme.component';

describe('OrderSchemeComponent ', () => {
  let component: OrderSchemeComponent ;
  let fixture: ComponentFixture<OrderSchemeComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSchemeComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
