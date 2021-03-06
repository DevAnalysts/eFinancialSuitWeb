import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCategoryComponent } from './accountcategory.component';

describe('AccountCategoryComponent', () => {
  let component: AccountCategoryComponent;
  let fixture: ComponentFixture<AccountCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
