import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryIncrementComponent } from './salary-increment.component';

const routes: Routes = [
  {
    path: '', component: SalaryIncrementComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryIncrementRoutingModule { }
