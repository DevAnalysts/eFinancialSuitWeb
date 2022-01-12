import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetSupplierComponent } from './asset-supplier.component';

const routes: Routes = [{
  path: '', component: AssetSupplierComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetSupplierRoutingModule { }
