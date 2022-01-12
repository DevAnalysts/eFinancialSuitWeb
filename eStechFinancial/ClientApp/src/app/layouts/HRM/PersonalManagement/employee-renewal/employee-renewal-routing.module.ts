import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeRenewalComponent } from './employee-renewal.component';

const routes: Routes = [
  {
    path: '', component: EmployeeRenewalComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRenewalRoutingModule { }
