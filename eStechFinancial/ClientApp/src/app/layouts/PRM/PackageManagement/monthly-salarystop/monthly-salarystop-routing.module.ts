import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlySalaryStopComponent } from './monthly-salarystop.component';

const routes: Routes = [
  {
    path: '', component: MonthlySalaryStopComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlySalaryStopRoutingModule { }
