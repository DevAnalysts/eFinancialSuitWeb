import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BioAttendanceComponent } from './bio-attendance.component';

const routes: Routes = [
  {
    path: '', component: BioAttendanceComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BioAttendanceRoutingModule { }
