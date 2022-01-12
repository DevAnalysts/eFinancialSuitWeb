import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnNoteComponent } from './purchase-return-note.component';

describe('PurchaseReturnNoteComponent', () => {
  let component: PurchaseReturnNoteComponent;
  let fixture: ComponentFixture<PurchaseReturnNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReturnNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReturnNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
