import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetStatusComponent } from './assetstatus.component';

const routes: Routes = [{
  path: '', component: AssetStatusComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetStatusRoutingModule { }
