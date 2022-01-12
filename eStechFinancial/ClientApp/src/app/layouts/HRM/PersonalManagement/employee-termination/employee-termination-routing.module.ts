import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeTerminationComponent } from './employee-termination.component';

const routes: Routes = [
  {
    path: '', component: EmployeeTerminationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTerminationRoutingModule { }
