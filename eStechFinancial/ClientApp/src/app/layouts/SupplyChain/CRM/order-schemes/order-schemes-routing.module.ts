import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderSchemesComponent } from './order-schemes.component';

const routes: Routes = [
  {
    path: '', component: OrderSchemesComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderSchemesRoutingModule { }
