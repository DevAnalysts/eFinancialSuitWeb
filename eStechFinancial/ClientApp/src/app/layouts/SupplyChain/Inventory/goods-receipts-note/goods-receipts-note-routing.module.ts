import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoodsReceiptsNoteComponent } from './goods-receipts-note/goods-receipts-note.component';

const routes: Routes = [
  {
    path: '', component: GoodsReceiptsNoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsReceiptsNoteRoutingModule { }
