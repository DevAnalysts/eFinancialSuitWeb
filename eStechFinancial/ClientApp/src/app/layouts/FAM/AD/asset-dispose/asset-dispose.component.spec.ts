import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDisposeComponent } from './asset-dispose.component';

describe('AssetDisposeComponent', () => {
  let component: AssetDisposeComponent;
  let fixture: ComponentFixture<AssetDisposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetDisposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDisposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
