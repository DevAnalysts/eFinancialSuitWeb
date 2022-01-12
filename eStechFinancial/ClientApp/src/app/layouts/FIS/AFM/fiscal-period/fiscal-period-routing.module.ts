import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiscalPeriodComponent } from './fiscal-period/fiscal-period.component';

const routes: Routes = [
  {
    path: '', component: FiscalPeriodComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscalPeriodRoutingModule { }
