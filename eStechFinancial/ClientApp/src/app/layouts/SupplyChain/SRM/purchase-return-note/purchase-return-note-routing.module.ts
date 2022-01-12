import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseReturnNoteComponent } from './purchase-return-note/purchase-return-note.component';

const routes: Routes = [{
  path: '', component: PurchaseReturnNoteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReturnNoteRoutingModule { }
