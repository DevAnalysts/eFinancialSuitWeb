import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeResignationComponent } from './employee-resignation.component';

const routes: Routes = [
  {
    path: '', component: EmployeeResignationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeResignationRoutingModule { }
