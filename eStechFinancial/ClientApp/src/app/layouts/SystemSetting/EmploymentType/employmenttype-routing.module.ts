import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmploymentTypeComponent } from './employmenttype.component';

const routes: Routes = [{
  path: '', component: EmploymentTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmploymentTypeRoutingModule { }
