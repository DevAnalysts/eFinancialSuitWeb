import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';

const routes: Routes = [{
  path: '', component: PurchaseInvoiceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInvoiceRoutingModule { }
