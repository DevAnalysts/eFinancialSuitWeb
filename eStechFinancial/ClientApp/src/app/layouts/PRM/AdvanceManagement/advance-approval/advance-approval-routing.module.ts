import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvanceApprovalComponent } from './advance-approval.component';

const routes: Routes = [
  {
    path: '', component: AdvanceApprovalComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceApprovalRoutingModule { }
