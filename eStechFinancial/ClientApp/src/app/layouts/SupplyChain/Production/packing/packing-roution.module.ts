import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackingComponent } from './packing/packing.component';

const routes: Routes = [
  {
    path: '', component: PackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackingRoutingModule { }
