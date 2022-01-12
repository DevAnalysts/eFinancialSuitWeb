import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTabDirective } from './new-tab.directive';
import { RandomColorDirective } from './random-color.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NewTabDirective, RandomColorDirective],
  exports:[NewTabDirective, RandomColorDirective]
})
export class DirectiveModule { }
