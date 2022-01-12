import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetRequisitionComponent } from './asset-requisition.component';

const routes: Routes = [
  {
    path: '', component: AssetRequisitionComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRequisitionRoutingModule { }
