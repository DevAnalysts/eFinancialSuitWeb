import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierCategoryComponent } from './suppliercategory.component';

const routes: Routes = [{
  path: '', component: SupplierCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierCategoryRoutingModule { }