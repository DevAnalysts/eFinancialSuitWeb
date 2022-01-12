import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankReceiptVoucherComponent } from './bank-receipt-voucher/bank-receipt-voucher.component';

const routes: Routes = [{
  path: '', component: BankReceiptVoucherComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankReceiptVoucherRoutingModule { }
