import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyExpenseComponent } from './daily-expense/daily-expense.component';

const routes: Routes = [{
  path: '', component: DailyExpenseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyExpenseRoutingModule { }
