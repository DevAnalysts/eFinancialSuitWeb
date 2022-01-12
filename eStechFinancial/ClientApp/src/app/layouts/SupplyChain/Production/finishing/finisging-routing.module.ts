import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinishingComponent } from './finishing/finishing.component';

const routes: Routes = [
  {
    path: '', component: FinishingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinishingRoutingModule { }
