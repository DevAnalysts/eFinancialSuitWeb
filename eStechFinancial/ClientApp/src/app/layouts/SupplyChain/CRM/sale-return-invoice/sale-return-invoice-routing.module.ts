import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleReturnInvoiceComponent } from './sale-return-invoice/sale-return-invoice.component';

const routes: Routes = [
  {
    path: '', component: SaleReturnInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReturnInvoiceRoutingModule { }
