import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageRegistrationComponent } from './pageregistration.component';

const routes: Routes = [{
  path: '', component: PageRegistrationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRegistrationRoutingModule { }
