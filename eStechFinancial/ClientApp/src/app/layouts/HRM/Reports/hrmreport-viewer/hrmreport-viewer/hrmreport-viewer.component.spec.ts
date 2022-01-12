import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HRMReportViewerComponent } from './hrmreport-viewer.component';

describe('HRMReportViewerComponent', () => {
  let component: HRMReportViewerComponent;
  let fixture: ComponentFixture<HRMReportViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HRMReportViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HRMReportViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
