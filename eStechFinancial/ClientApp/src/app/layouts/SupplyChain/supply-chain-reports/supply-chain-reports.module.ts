import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplyChainReportsRoutingModule } from './supply-chain-reports-routing.module';
import { SupplyChainReportsComponent } from './supply-chain-reports/supply-chain-reports.component';
import { SpinnerModule } from '@shared/spinner-module/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    SupplyChainReportsRoutingModule,
    SpinnerModule
  ],
  declarations: [SupplyChainReportsComponent]
})
export class SupplyChainReportsModule { }
