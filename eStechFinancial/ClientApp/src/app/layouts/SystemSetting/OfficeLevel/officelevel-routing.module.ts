import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeLevelComponent } from './officelevel.component';

const routes: Routes = [{
  path: '', component: OfficeLevelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeLevelRoutingModule { }
