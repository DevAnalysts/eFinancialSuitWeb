import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRequisitionComponent } from './asset-requisition.component';

describe('AssetRequisitionComponent', () => {
  let component: AssetRequisitionComponent;
  let fixture: ComponentFixture<AssetRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
