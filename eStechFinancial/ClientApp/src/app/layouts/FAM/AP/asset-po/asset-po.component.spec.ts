import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPOComponent } from './asset-po.component';

describe('AssetPOComponent', () => {
  let component: AssetPOComponent;
  let fixture: ComponentFixture<AssetPOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetPOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
