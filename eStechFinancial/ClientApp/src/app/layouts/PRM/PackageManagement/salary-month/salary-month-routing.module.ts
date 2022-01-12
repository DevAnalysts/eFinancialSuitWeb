import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryMonthComponent } from './salary-month.component';

const routes: Routes = [
  {
    path: '', component: SalaryMonthComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryMonthRoutingModule { }
