import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetGRNComponent } from './asset-grn.component';

describe('AssetGRNComponent', () => {
  let component: AssetGRNComponent;
  let fixture: ComponentFixture<AssetGRNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetGRNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetGRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
