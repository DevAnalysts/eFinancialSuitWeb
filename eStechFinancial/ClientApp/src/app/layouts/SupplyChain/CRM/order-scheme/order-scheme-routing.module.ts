import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderSchemeComponent } from './order-scheme.component';

const routes: Routes = [
  {
    path: '', component: OrderSchemeComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderSchemeRoutingModule { }
