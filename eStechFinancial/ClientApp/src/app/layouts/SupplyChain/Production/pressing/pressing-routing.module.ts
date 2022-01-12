import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PressingComponent } from './pressing/pressing.component';

const routes: Routes = [
  {
    path: '', component: PressingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PressingRoutingModule { }
