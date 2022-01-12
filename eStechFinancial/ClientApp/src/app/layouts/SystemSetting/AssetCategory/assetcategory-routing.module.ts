import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetCategoryComponent } from './assetcategory.component';

const routes: Routes = [{
  path: '', component: AssetCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetCategoryRoutingModule { }
