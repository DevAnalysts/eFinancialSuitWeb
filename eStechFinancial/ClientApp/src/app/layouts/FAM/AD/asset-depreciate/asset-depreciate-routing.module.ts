import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetDepreciateComponent } from './asset-depreciate.component';

const routes: Routes = [{
  path: '', component: AssetDepreciateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetDepreciateRoutingModule { }
