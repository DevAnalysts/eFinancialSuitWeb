import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseRetailInvoiceListComponent } from './purchase-retail-invoice-list/purchase-retail-invoice-list.component';

const routes: Routes = [
  {
    path: '', component: PurchaseRetailInvoiceListComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRetailInvoiceListRoutingModule { }
