import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReversingComponent } from './reversing/reversing.component';

const routes: Routes = [
  {
    path: '', component: ReversingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReversingRoutingModule { }
