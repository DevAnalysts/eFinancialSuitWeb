import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveEntryComponent } from './leave-entry.component';

const routes: Routes = [
  {
    path: '', component: LeaveEntryComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveEntryRoutingModule { }
