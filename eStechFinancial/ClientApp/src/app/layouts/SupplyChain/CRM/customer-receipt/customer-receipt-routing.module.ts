import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerReceiptComponent } from './customer-receipt/customer-receipt.component';

const routes: Routes = [

  {
    path: '', component: CustomerReceiptComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReceiptRoutingModule { }
