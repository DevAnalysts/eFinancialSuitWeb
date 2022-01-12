import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetApprovalComponent } from './asset-approval.component';

const routes: Routes = [
  {
    path: '', component: AssetApprovalComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetApprovalRoutingModule { }
