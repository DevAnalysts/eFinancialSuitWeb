import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryReviewComponent } from './salary-review.component';

const routes: Routes = [
  {
    path: '', component: SalaryReviewComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryReviewRoutingModule { }
