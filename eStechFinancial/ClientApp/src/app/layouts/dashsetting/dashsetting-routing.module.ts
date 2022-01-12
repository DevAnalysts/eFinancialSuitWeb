/// <reference path="dashsetting.component.ts" />
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashSettingComponent } from './dashsetting.component';

const routes: Routes = [
  {
    path: '', component: DashSettingComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashSettingRoutingModule { }
