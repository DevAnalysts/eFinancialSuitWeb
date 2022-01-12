import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemPackingTypeComponent } from './itempackingtype.component';

const routes: Routes = [{
  path: '', component: ItemPackingTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemPackingTypeRoutingModule { }
