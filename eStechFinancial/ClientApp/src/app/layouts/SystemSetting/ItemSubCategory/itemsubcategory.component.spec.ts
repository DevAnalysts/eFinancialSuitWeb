import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSubCategoryComponent } from './itemsubcategory.component';

describe('ItemSubCategoryComponent', () => {
  let component: ItemSubCategoryComponent;
  let fixture: ComponentFixture<ItemSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
