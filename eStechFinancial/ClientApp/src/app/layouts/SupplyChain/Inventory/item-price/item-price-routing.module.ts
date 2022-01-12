import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemPriceComponent } from './item-price.component';

const routes: Routes = [
  {
    path: '', component: ItemPriceComponent 
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemPriceRoutingModule { }
