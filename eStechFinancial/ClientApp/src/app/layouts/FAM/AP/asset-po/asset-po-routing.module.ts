import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetPOComponent } from './asset-po.component';

const routes: Routes = [
  {
    path: '', component: AssetPOComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetPORoutingModule { }
