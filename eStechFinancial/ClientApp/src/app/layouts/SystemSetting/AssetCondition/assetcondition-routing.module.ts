import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetConditionComponent } from './assetcondition.component';

const routes: Routes = [{
  path: '', component: AssetConditionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetConditionRoutingModule { }
