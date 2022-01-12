import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDisassemblyComponent } from './product-disassembly/product-disassembly.component';

const routes: Routes = [{
  path: '', component: ProductDisassemblyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDisassemblyRoutingModule { }
