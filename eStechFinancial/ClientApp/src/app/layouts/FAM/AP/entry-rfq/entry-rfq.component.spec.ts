import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryRFQComponent } from './entry-rfq.component';

describe('EntryRFQComponent', () => {
  let component: EntryRFQComponent;
  let fixture: ComponentFixture<EntryRFQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryRFQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryRFQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
