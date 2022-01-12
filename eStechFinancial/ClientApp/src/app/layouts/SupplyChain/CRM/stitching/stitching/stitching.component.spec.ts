import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StitchingComponent } from './stitching.component';

describe('StitchingComponent', () => {
  let component: StitchingComponent;
  let fixture: ComponentFixture<StitchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StitchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StitchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
