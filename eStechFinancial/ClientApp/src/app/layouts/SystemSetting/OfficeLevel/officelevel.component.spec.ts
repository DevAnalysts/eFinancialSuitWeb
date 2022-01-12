import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeLevelComponent } from './officelevel.component';

describe('OfficeLevelComponent', () => {
  let component: OfficeLevelComponent;
  let fixture: ComponentFixture<OfficeLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfficeLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
