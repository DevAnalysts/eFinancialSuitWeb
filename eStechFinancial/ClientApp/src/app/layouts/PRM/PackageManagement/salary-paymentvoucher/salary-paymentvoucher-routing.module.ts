import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryPaymentVoucherComponent } from './salary-paymentvoucher.component';

const routes: Routes = [
  {
    path: '', component: SalaryPaymentVoucherComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryPaymentVoucherRoutingModule { }
