import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailySaleLoadComponent } from './daily-sale-load.component';

const routes: Routes = [
  {
    path: '', component: DailySaleLoadComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailySaleLoadRoutingModule { }
