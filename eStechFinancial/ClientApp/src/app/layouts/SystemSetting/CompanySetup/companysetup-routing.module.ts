import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanySetupComponent } from './companysetup.component';

const routes: Routes = [{
  path: '', component: CompanySetupComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanySetupRoutingModule { }
