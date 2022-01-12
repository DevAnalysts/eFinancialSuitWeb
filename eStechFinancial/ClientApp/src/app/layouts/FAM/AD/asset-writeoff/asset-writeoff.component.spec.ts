import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetWriteoffComponent } from './asset-writeoff.component';

describe('AssetWriteoffComponent', () => {
  let component: AssetWriteoffComponent;
  let fixture: ComponentFixture<AssetWriteoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetWriteoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetWriteoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
