import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleReplacementComponent } from './sale-replacement.component';

describe('SaleReplacementComponent', () => {
  let component: SaleReplacementComponent;
  let fixture: ComponentFixture<SaleReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
