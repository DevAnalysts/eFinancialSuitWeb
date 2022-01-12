import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[rclr]',
  host: {
    '(click)': 'onClick()'
  }
})
export class RandomColorDirective {

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.updateColor();
  }
  getColor() {
    //return "#"+((1<<24)*Math.random()|0).toString(16);
    //return '#'+Math.floor(Math.random()*16777215).toString(16);
    return 'hsla(' + Math.floor(Math.random()*360) + ', 100%, 70%, 1)';
  }
  onClick() {
    this.updateColor("lightgrey");
    window.setTimeout(() => this.updateColor(),1000);
  }
  updateColor(color = this.getColor()) {
   
    this.renderer.setStyle(this.element.nativeElement, 'background-color', color);
  }

}
