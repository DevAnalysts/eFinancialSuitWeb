import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoucherApprovalComponent } from './voucher-approval/voucher-approval.component';

const routes: Routes = [{
  path: '', component: VoucherApprovalComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherApprovalRoutingModule { }
