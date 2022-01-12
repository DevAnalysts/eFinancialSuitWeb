import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';

const routes: Routes = [
  {
    path: '', component: SaleInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleInvoiceRoutingModule { }
