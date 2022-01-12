import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseRetialInvoiceComponent } from './purchase-retail-invoice/purchase-retail-invoice.component';

const routes: Routes = [
  {
    path: '', component: PurchaseRetialInvoiceComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRetialInvoiceRoutingModule { }
