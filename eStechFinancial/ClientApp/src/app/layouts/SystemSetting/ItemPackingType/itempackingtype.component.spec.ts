import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPackingTypeComponent } from './itempackingtype.component';

describe('ItemPackingTypeComponent', () => {
  let component: ItemPackingTypeComponent;
  let fixture: ComponentFixture<ItemPackingTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPackingTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPackingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
