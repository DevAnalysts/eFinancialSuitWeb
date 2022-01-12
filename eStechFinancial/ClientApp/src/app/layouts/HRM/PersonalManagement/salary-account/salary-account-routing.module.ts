import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryAccountComponent } from './salary-account.component';

const routes: Routes = [
  {
    path: '', component: SalaryAccountComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryAccountRoutingModule { }
