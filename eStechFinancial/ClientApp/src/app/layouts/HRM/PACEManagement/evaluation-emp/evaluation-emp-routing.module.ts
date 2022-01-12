import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluationEmpComponent } from './evaluation-emp.component';

const routes: Routes = [
  {
    path: '', component: EvaluationEmpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationEmpRoutingModule { }
