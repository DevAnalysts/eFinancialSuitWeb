import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoodsDispatchNoteComponent } from './goods-dispatch-note/goods-dispatch-note.component';

const routes: Routes = [{
  path: '', component: GoodsDispatchNoteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsDispatchNoteRoutingModule { }
