import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PRMReportViewerComponent } from './prmreport-viewer.component';

describe('PRMReportViewerComponent', () => {
  let component: PRMReportViewerComponent;
  let fixture: ComponentFixture<PRMReportViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PRMReportViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PRMReportViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
