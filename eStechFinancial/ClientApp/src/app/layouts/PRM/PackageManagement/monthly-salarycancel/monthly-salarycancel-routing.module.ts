import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlySalaryCancelComponent } from './monthly-salarycancel.component';

const routes: Routes = [
  {
    path: '', component: MonthlySalaryCancelComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlySalaryCancelRoutingModule { }
