import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetailInvoiceComponent } from './retail-invoice/retail-invoice.component';

const routes: Routes = [{
  path: '', component: RetailInvoiceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailInvoiceRoutingModule { }
