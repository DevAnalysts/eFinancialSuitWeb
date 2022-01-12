import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierContactComponent } from './supplier-contact.component';

describe('SupplierContactComponent', () => {
  let component: SupplierContactComponent;
  let fixture: ComponentFixture<SupplierContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
