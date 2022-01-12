import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeductionComponent } from './deduction.component';

const routes: Routes = [{
  path: '', component: DeductionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeductionRoutingModule { }
