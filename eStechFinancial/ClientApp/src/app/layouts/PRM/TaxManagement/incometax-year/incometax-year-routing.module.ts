import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncomeTaxYearComponent } from './incometax-year.component';

const routes: Routes = [
  {
    path: '', component: IncomeTaxYearComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeTaxYearRoutingModule { }
