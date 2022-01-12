import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeCategoryComponent } from './employeecategory.component';

const routes: Routes = [{
  path: '', component: EmployeeCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeCategoryRoutingModule { }
