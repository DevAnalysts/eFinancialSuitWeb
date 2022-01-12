import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleOrderImportComponent } from './sale-order-import.component';

describe('SaleOrderImportComponent', () => {
  let component: SaleOrderImportComponent;
  let fixture: ComponentFixture<SaleOrderImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
