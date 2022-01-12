import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemColorComponent } from './ItemColor.component';

const routes: Routes = [{
  path: '', component: ItemColorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemColorRoutingModule { }
