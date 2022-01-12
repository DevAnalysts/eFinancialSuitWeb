import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryPackageComponent } from './salary-package.component';

const routes: Routes = [
  {
    path: '', component: SalaryPackageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryPackageRoutingModule { }
