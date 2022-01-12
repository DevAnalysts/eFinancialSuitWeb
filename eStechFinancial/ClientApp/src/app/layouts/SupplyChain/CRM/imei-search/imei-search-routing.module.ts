import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IMEISearchComponent } from './imei-search/imei-search.component';

const routes: Routes = [{
  path: '', component: IMEISearchComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IMEISearchRoutingModule { }
