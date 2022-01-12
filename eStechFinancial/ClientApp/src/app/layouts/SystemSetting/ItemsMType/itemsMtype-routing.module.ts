import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsMTypeComponent } from './itemsMtype.component';

const routes: Routes = [{
  path: '', component: ItemsMTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsMTypeRoutingModule { }
