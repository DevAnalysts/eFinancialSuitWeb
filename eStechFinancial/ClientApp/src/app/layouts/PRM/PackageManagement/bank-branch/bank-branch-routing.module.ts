import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankBranchComponent } from './bank-branch.component';

const routes: Routes = [{
  path: '', component: BankBranchComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankBranchRoutingModule { }
