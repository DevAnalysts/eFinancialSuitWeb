import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequeCancelComponent } from './cheque-cancel/cheque-cancel.component';

const routes: Routes = [{
  path: '', component: ChequeCancelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeCancelRoutingModule { }
