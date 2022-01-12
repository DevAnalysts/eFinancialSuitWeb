import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';

const routes: Routes = [
  {
    path: '', component: SaleQuotationComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleQuotationRoutingModule { }
