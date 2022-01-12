import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCategoryComponent } from './customercategory.component';

const routes: Routes = [{
  path: '', component: CustomerCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCategoryRoutingModule { }
