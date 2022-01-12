import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisposalVoucherComponent } from './disposal-voucher.component';

const routes: Routes = [
  {
    path: '', component: DisposalVoucherComponent 
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisposalVoucherRoutingModule { }
