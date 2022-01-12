import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleOrderComponent } from './sale-order/sale-order.component';

const routes: Routes = [
  {
    path: '', component: SaleOrderComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleOrderRoutingModule { }
