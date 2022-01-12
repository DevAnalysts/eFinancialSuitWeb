import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleRetailInvoiceListComponent } from './sale-retail-invoice-list/sale-retail-invoice-list.component';


const routes: Routes = [
  {
    path: '', component: SaleRetailInvoiceListComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRetailInvoiceListRoutingModule { }
