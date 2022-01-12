import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartOfAccountsComponent } from './chartofaccount/chartofaccount.component';

const routes: Routes = [{
  path: '', component: ChartOfAccountsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartOfAccountsRoutingModule { }
