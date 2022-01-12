import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWarrantyComponent } from './ItemWarranty.component';

describe('ItemWarrantyComponent', () => {
  let component: ItemWarrantyComponent;
  let fixture: ComponentFixture<ItemWarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemWarrantyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
