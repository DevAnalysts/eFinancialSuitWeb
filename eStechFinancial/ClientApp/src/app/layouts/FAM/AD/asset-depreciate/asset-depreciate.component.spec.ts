import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDepreciateComponent } from './asset-depreciate.component';

describe('AssetDepreciateComponent', () => {
  let component: AssetDepreciateComponent;
  let fixture: ComponentFixture<AssetDepreciateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetDepreciateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDepreciateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
