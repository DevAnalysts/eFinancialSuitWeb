import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleOrderContractComponent } from './sale-order-contract/sale-order-contract.component';

const routes: Routes = [
  {
    path: '', component: SaleOrderContractComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleOrderContractRoutingModule { }
