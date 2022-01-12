import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLevelComponent } from './accountlevel.component';

const routes: Routes = [{
  path: '', component: AccountLevelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountLevelRoutingModule { }
