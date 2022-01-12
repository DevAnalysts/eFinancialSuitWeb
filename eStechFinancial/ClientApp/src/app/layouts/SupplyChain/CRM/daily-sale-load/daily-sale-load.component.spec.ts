import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DailySaleLoadComponent } from './daily-sale-load.component';

describe('DailySaleLoadComponent', () => {
  let component: DailySaleLoadComponent;
  let fixture: ComponentFixture<DailySaleLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailySaleLoadComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySaleLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
