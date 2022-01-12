import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedirectRoutingModule } from './redirect-routing.module';
import { RedirectComponent } from './redirect/redirect.component';
import { SpinnerModule } from '@shared/spinner-module/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    RedirectRoutingModule,
    SpinnerModule
  ],
  declarations: [RedirectComponent]
})
export class RedirectModule { }
