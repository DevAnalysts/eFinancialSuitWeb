import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlySalaryComponent } from './monthly-salary.component';

const routes: Routes = [
  {
    path: '', component: MonthlySalaryComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlySalaryRoutingModule { }
