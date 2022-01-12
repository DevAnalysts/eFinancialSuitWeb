import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleOrderImportComponent } from './sale-order-import/sale-order-import.component';

const routes: Routes = [
  {
    path: '', component: SaleOrderImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleOrderImportRoutingModule { }
