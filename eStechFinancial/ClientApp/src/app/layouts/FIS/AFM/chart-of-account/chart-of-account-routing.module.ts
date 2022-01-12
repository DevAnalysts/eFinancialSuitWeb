import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartOfAccountComponent } from './chart-of-account/chart-of-account.component';

const routes: Routes = [{
  path: '', component: ChartOfAccountComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartOfAccountRoutingModule { }
