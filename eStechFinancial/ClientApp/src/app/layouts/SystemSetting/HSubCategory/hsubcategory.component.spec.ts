import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HSubCategoryComponent } from './hsubcategory.component';

describe('HSubCategoryComponent', () => {
  let component: HSubCategoryComponent;
  let fixture: ComponentFixture<HSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
