import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BioAttendanceComponent } from './bio-attendance.component';

describe('BioAttendanceComponent', () => {
  let component: BioAttendanceComponent;
  let fixture: ComponentFixture<BioAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BioAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BioAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
