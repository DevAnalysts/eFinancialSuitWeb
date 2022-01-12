import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerReceiptImportComponent } from './customer-receipt-import/customer-receipt-import.component';

const routes: Routes = [
  {
    path: '', component: CustomerReceiptImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReceiptImportRoutingModule { }
