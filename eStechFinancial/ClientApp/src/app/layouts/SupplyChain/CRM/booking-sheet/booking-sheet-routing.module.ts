import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingSheetComponent } from './booking-sheet.component';

const routes: Routes = [
  {
    path: '', component: BookingSheetComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingSheetRoutingModule { }
