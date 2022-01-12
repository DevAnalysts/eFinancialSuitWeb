import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluationGroupComponent } from './evaluation-group.component';

const routes: Routes = [
  {
    path: '', component: EvaluationGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationGroupRoutingModule { }
