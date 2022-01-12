import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsMTypeComponent } from './itemsMtype.component';

describe('ItemsMTypeComponent', () => {
  let component: ItemsMTypeComponent;
  let fixture: ComponentFixture<ItemsMTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsMTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsMTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
