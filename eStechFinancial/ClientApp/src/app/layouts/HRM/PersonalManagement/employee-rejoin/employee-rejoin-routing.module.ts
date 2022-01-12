import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeRejoinComponent } from './employee-rejoin.component';

const routes: Routes = [
  {
    path: '', component: EmployeeRejoinComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRejoinRoutingModule { }
