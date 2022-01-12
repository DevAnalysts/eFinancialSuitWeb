import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankSalaryComponent } from './banksalary.component';

const routes: Routes = [{
  path: '', component: BankSalaryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankSalaryRoutingModule { }
