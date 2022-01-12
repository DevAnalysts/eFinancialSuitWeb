import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyVahicleRoutComponent } from './daily-vahicle-rout/daily-vahicle-rout.component';

const routes: Routes = [{
  path: '', component: DailyVahicleRoutComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyVahicleRoutRoutingModule { }
