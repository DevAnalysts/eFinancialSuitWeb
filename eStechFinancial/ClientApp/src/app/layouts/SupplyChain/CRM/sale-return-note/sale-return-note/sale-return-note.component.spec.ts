import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnNoteComponent } from './sale-return-note.component';

describe('SaleReturnNoteComponent', () => {
  let component: SaleReturnNoteComponent;
  let fixture: ComponentFixture<SaleReturnNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReturnNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
