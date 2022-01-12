import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemBrandComponent } from './ItemBrand.component';

const routes: Routes = [{
  path: '', component: ItemBrandComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemBrandRoutingModule { }
