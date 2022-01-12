import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequeBookComponent } from './cheque-book/cheque-book.component';

const routes: Routes = [{
  path: '', component: ChequeBookComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeBookRoutingModule { }
