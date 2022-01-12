import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceSheetComponent } from './attendance-sheet.component';

const routes: Routes = [
  {
    path: '', component: AttendanceSheetComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceSheetRoutingModule { }
