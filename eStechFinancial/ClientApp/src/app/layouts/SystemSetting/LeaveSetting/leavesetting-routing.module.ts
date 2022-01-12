import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveSettingComponent } from './leavesetting.component';

const routes: Routes = [{
  path: '', component: LeaveSettingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveSettingRoutingModule { }
