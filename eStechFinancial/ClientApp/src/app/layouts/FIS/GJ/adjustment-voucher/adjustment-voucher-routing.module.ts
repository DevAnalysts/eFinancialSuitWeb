import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdjustmentVoucherComponent } from './adjustment-voucher/adjustment-voucher.component';

const routes: Routes = [
  {
    path: '', component: AdjustmentVoucherComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentVoucherRoutingModule { }
