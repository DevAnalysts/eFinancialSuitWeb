import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HSubCategoryComponent } from './hsubcategory.component';

const routes: Routes = [{
  path: '', component: HSubCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HSubCategoryRoutingModule { }
