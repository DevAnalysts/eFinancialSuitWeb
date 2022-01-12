import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemColorComponent } from './ItemColor.component';

describe('ItemColorComponent', () => {
  let component: ItemColorComponent;
  let fixture: ComponentFixture<ItemColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
