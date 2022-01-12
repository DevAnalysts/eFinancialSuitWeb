import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepreciationVoucherComponent } from './depreciation-voucher.component';

const routes: Routes = [
  {
    path: '', component: DepreciationVoucherComponent 
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciationVoucherRoutingModule { }
