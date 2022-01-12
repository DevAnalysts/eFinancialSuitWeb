import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsDispatchNoteComponent } from './goods-dispatch-note.component';

describe('GoodsDispatchNoteComponent', () => {
  let component: GoodsDispatchNoteComponent;
  let fixture: ComponentFixture<GoodsDispatchNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsDispatchNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsDispatchNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
