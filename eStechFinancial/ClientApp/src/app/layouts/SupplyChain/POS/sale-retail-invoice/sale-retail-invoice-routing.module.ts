import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleRetailInvoiceComponent } from './sale-retail-invoice/sale-retail-invoice.component';

const routes: Routes = [{
  path: '', component: SaleRetailInvoiceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRetailInvoiceRoutingModule { }
