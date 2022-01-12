import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvanceTypeComponent } from './advancetype.component';

const routes: Routes = [{
  path: '', component: AdvanceTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceTypeRoutingModule { }
