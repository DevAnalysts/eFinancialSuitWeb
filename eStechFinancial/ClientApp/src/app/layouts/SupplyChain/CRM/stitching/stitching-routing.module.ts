import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StitchingComponent } from './stitching/stitching.component';

const routes: Routes = [
  {
    path: '', component: StitchingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StitchingRoutingModule { }
