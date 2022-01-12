import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemModelComponent } from './itemmodel.component';

const routes: Routes = [{
  path: '', component: ItemModelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemModelRoutingModule { }
