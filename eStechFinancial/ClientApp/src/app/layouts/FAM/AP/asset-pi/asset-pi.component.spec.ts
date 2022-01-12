import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPIComponent } from './asset-pi.component';

describe('AssetPIComponent ', () => {
  let component: AssetPIComponent ;
  let fixture: ComponentFixture<AssetPIComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetPIComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPIComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
