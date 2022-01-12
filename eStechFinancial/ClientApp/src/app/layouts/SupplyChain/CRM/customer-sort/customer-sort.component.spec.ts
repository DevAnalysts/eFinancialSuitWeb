import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSortComponent } from './customer-sort.component';

describe('CustomerSortComponent', () => {
  let component: CustomerSortComponent;
  let fixture: ComponentFixture<CustomerSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerSortComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
