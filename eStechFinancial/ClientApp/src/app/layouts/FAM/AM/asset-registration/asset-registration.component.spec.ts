import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRegistrationComponent } from './asset-registration.component';

describe('AssetRegistrationComponent', () => {
  let component: AssetRegistrationComponent;
  let fixture: ComponentFixture<AssetRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
