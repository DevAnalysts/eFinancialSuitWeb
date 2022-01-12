import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleInvoiceDayWiseComponent } from './sale-invoice-day/sale-invoice-day.component';

const routes: Routes = [
  {
    path: '', component: SaleInvoiceDayWiseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleInvoiceDayWiseRoutingModule { }
