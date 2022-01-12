import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetWriteoffComponent } from './asset-writeoff.component';

const routes: Routes = [{
  path: '', component: AssetWriteoffComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetWriteoffRoutingModule { }
