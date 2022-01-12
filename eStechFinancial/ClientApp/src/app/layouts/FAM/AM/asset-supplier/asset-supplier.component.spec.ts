import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSupplierComponent } from './asset-supplier.component';

describe('AssetSupplierComponent', () => {
  let component: AssetSupplierComponent;
  let fixture: ComponentFixture<AssetSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
