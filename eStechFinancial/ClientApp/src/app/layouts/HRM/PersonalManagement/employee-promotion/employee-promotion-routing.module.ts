import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePromotionComponent } from './employee-promotion.component';

const routes: Routes = [
  {
    path: '', component: EmployeePromotionComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePromotionRoutingModule { }
