import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetPIComponent  } from './asset-pi.component';

const routes: Routes = [{
  path: '', component: AssetPIComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetPIRoutingModule { }
