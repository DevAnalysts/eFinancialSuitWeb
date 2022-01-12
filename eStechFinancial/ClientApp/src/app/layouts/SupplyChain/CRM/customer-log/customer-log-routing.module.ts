import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerLogComponent } from './customer-log.component';

const routes: Routes = [{
  path: '', component: CustomerLogComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerLogRoutingModule { }
