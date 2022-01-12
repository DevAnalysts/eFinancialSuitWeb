import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContactComponent } from './supplier-contact.component';

const routes: Routes = [{
  path: '', component: SupplierContactComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContactRoutingModule { }
