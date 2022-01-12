import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleReplacementComponent } from './sale-replacement/sale-replacement.component';

const routes: Routes = [
  {
    path: '', component: SaleReplacementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReplacementRoutingModule { }
