import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxTypeComponent } from './taxtype.component';

const routes: Routes = [{
  path: '', component: TaxTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxTypeRoutingModule { }
