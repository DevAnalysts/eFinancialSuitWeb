import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetDisposeComponent } from './asset-dispose.component';

const routes: Routes = [{
  path: '', component: AssetDisposeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetDisposeRoutingModule { }
