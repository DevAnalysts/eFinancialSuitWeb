import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankPaymentVoucherComponent } from './bank-payment-voucher/bank-payment-voucher.component';

const routes: Routes = [{
  path: '', component: BankPaymentVoucherComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankPaymentVoucherRoutingModule { }
