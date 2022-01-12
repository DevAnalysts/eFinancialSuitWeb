import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetRFQComponent } from './asset-rfq.component';

const routes: Routes = [
  {
    path: '', component: AssetRFQComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRFQRoutingModule { }
