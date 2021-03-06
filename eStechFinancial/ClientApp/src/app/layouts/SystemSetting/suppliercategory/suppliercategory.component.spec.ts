import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCategoryComponent } from './suppliercategory.component';

describe('SuppliercategoryComponent', () => {
  let component: SupplierCategoryComponent;
  let fixture: ComponentFixture<SupplierCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
