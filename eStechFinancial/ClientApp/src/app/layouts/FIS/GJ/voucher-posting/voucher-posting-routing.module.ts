import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoucherPostingComponent } from './voucher-posting/voucher-posting.component';

const routes: Routes = [{
  path: '', component: VoucherPostingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherPostingRoutingModule { }
