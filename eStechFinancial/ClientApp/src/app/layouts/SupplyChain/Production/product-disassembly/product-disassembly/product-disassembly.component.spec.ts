import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDisassemblyComponent } from './product-disassembly.component';

describe('ProductDisassemblyComponent', () => {
  let component: ProductDisassemblyComponent;
  let fixture: ComponentFixture<ProductDisassemblyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDisassemblyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDisassemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
