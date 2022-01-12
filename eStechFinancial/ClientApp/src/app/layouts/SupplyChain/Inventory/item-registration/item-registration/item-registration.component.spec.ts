import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRegistrationComponent } from './item-registration.component';

describe('ItemRegistrationComponent', () => {
  let component: ItemRegistrationComponent;
  let fixture: ComponentFixture<ItemRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
