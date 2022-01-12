import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageAllowanceComponent } from './packageallowance.component';

const routes: Routes = [{
  path: '', component: PackageAllowanceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageAllowanceRoutingModule { }
