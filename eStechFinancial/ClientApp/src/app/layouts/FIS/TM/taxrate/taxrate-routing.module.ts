import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxRateComponent } from './taxrate/taxrate.component';

const routes: Routes = [{
  path: '', component: TaxRateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRateRoutingModule { }
