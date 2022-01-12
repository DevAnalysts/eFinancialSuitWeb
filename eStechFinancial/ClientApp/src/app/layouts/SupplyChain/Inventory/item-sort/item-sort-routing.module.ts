import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemSortComponent } from './item-sort.component';

const routes: Routes = [
  {
    path: '', component: ItemSortComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemSortRoutingModule { }
