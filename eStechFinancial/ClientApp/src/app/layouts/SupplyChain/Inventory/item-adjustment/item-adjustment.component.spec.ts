import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAdjustmentComponent } from './item-adjustment.component';

describe('ItemAdjustmentComponent', () => {
  let component: ItemAdjustmentComponent;
  let fixture: ComponentFixture<ItemAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
