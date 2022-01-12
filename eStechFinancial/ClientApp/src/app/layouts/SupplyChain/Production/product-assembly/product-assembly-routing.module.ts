import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductAssemblyComponent } from './product-assembly/product-assembly.component';

const routes: Routes = [{
  path: '', component: ProductAssemblyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAssemblyRoutingModule { }
