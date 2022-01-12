import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseTypeComponent } from './expensetype.component';

const routes: Routes = [{
  path: '', component: ExpenseTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseTypeRoutingModule { }
