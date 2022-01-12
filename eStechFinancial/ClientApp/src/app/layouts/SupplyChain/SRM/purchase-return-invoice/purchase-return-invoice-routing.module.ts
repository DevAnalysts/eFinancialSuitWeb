import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseReturnInvoiceComponent } from './purchase-return-invoice/purchase-return-invoice.component';

const routes: Routes = [
  {
    path: '', component: PurchaseReturnInvoiceComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReturnInvoiceRoutingModule { }
