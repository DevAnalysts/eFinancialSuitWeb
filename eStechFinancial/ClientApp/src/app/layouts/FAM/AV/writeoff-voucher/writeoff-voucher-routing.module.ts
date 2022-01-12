import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WriteOffVoucherComponent } from './writeoff-voucher.component';

const routes: Routes = [
  {
    path: '', component: WriteOffVoucherComponent 
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WriteOffVoucherRoutingModule { }
