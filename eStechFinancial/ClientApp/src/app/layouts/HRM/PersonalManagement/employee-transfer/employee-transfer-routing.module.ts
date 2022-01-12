import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeTransferComponent } from './employee-transfer.component';

const routes: Routes = [
  {
    path: '', component: EmployeeTransferComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTransferRoutingModule { }
