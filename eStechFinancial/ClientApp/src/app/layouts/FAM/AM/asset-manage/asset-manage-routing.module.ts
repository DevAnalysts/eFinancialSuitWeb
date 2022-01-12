import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetManageComponent } from './asset-manage.component';

const routes: Routes = [{
  path: '', component: AssetManageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManageRoutingModule { }
