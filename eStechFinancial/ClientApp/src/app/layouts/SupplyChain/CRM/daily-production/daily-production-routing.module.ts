import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { DailyProductionComponent } from './daily-production.component';

const routes: Routes = [{
  path: '', component: DailyProductionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyProductionRoutingModule { }
