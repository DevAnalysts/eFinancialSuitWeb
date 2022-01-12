import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetRegistrationComponent } from './asset-registration.component';

const routes: Routes = [{
  path: '', component: AssetRegistrationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRegistrationRoutingModule { }
