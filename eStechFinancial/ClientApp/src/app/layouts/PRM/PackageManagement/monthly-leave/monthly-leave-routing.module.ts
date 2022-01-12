import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyLeaveComponent } from './monthly-leave.component';

const routes: Routes = [
  {
    path: '', component: MonthlyLeaveComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyLeaveRoutingModule { }
