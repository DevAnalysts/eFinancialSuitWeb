import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemWarrantyComponent } from './ItemWarranty.component';

const routes: Routes = [{
  path: '', component: ItemWarrantyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemWarrantyRoutingModule { }
