import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleReturnNoteComponent } from './sale-return-note/sale-return-note.component';

const routes: Routes = [
  {
    path: '', component: SaleReturnNoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReturnNoteRoutingModule { }
