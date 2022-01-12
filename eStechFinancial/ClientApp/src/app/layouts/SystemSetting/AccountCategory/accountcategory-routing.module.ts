import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountCategoryComponent } from './accountcategory.component';

const routes: Routes = [{
  path: '', component: AccountCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountCategoryRoutingModule { }
