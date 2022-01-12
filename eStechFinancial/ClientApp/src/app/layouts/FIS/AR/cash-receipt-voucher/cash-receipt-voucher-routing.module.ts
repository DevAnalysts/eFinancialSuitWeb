import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashReceiptVoucherComponent } from './cash-receipt-voucher/cash-receipt-voucher.component';

const routes: Routes = [{
  path: '', component: CashReceiptVoucherComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashReceiptVoucherRoutingModule { }
