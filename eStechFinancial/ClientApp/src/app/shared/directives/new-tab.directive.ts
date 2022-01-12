import { Directive, ElementRef, HostListener, Input, Inject  } from '@angular/core';

function getWindow (): any {
  return window;
}

@Directive({
  selector: '[newtab]'
})
export class NewTabDirective {

  //@Input('olinwLink') link: string; //intro a new attribute, if independent from routerLink
  @Input('routerLink') link: string;
  constructor(private el: ElementRef) {
  }
  @HostListener('mousedown') onMouseEnter() {
      getWindow().open(this.link || '');
  }
}
