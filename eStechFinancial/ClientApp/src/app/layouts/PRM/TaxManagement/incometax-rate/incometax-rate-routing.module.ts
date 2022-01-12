import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncomeTaxRateComponent } from './incometax-rate.component';

const routes: Routes = [
  {
    path: '', component: IncomeTaxRateComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeTaxRateRoutingModule { }
