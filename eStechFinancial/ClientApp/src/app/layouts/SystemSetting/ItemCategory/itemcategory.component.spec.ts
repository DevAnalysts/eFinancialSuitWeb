import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCategoryComponent } from './itemcategory.component';

describe('ItemCategoryComponent', () => {
  let component: ItemCategoryComponent;
  let fixture: ComponentFixture<ItemCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
