import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierPaymentComponent } from './supplier-payment/supplier-payment.component';

const routes: Routes = [
  {
    path: '', component: SupplierPaymentComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierPaymentRoutingModule { }
