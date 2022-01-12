import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRFQComponent } from './asset-rfq.component';

describe('AssetRFQComponent', () => {
  let component: AssetRFQComponent;
  let fixture: ComponentFixture<AssetRFQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetRFQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRFQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
