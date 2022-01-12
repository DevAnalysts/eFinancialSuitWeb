import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';

const routes: Routes = [
  {
    path: '', component: StockTransferComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTransferRoutingModule { }
