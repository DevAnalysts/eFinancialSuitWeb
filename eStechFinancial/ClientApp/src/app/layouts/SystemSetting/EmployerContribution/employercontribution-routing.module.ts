import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerContributionComponent } from './employercontribution.component';

const routes: Routes = [{
  path: '', component: EmployerContributionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerContributionRoutingModule { }
