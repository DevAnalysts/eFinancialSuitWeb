import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetSubCategoryComponent } from './assetsubcategory.component';

const routes: Routes = [{
  path: '', component: AssetSubCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetSubCategoryRoutingModule { }
