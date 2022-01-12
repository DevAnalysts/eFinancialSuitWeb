import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleRetailInvoiceEditComponent } from './sale-retail-invoice-edit/sale-retail-invoice-edit.component';

const routes: Routes = [{
  path: '', component: SaleRetailInvoiceEditComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRetailInvoiceEditRoutingModule { }
