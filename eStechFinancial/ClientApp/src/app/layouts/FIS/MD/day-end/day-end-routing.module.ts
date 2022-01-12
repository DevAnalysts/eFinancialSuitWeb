import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DayEndComponent } from './day-end/day-end.component';

const routes: Routes = [
  {
    path: '', component: DayEndComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DayEndRoutingModule { }
