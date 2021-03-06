import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoucherHistoryComponent } from './voucher-history/voucher-history.component';

const routes: Routes = [{
  path: '', component: VoucherHistoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherHistoryRoutingModule { }
