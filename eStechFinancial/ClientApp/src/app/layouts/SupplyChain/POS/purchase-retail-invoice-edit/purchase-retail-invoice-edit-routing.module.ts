import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseRetialInvoiceEditComponent } from './purchase-retail-invoice-edit/purchase-retail-invoice-edit.component';

const routes: Routes = [
  {
    path: '', component: PurchaseRetialInvoiceEditComponent
}
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRetialInvoiceEditRoutingModule { }
