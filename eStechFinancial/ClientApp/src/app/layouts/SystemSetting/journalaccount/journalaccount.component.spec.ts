import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalaccountComponent } from './journalaccount.component';

describe('JournalaccountComponent', () => {
  let component: JournalaccountComponent;
  let fixture: ComponentFixture<JournalaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
