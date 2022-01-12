import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetingComponent } from './budgeting/budgeting.component';

const routes: Routes = [
  {
    path: '', component: BudgetingComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetingRoutingModule { }
