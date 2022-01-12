import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSortComponent } from './customer-sort.component';

const routes: Routes = [
  {
    path: '', component: CustomerSortComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSortRoutingModule { }
