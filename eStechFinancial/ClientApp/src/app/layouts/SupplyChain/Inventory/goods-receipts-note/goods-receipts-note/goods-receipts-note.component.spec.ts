import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptsNoteComponent } from './goods-receipts-note.component';

describe('GoodsReceiptsNoteComponent', () => {
  let component: GoodsReceiptsNoteComponent;
  let fixture: ComponentFixture<GoodsReceiptsNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsReceiptsNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReceiptsNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
