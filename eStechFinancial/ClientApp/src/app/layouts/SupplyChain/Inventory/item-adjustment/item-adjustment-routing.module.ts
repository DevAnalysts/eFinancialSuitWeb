import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemAdjustmentComponent } from './item-adjustment.component';

const routes: Routes = [
  {
    path: '', component: ItemAdjustmentComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemAdjustmentRoutingModule { }
