import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplyChainReportsComponent } from './supply-chain-reports/supply-chain-reports.component';

const routes: Routes = [
  {
    path: '', component: SupplyChainReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyChainReportsRoutingModule { }
