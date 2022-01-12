import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashPaymentVoucherComponent } from './cash-payment-voucher/cash-payment-voucher.component';

const routes: Routes = [{
  path: '', component: CashPaymentVoucherComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashPaymentVoucherRoutingModule { }
