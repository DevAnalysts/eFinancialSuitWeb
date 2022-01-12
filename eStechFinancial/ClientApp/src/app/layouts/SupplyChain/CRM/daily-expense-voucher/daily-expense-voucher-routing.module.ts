import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyExpenseVoucherComponent } from './daily-expense-voucher/daily-expense-voucher.component';

const routes: Routes = [{
  path: '', component: DailyExpenseVoucherComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyExpenseVoucherRoutingModule { }
