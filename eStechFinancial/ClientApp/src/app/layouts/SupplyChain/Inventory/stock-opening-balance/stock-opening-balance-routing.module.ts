import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockOpeningBalanceComponent } from './stock-opening-balance.component';

const routes: Routes = [
  {
    path: '', component: StockOpeningBalanceComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockOpeningBalanceRoutingModule { }
