import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversingComponent } from './reversing.component';

describe('ReversingComponent', () => {
  let component: ReversingComponent;
  let fixture: ComponentFixture<ReversingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReversingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReversingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
