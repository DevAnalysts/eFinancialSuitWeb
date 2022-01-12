import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetGRNComponent } from './asset-grn.component';

const routes: Routes = [
  {
    path: '', component: AssetGRNComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetGRNRoutingModule { }
