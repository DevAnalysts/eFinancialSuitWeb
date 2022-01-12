import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemRegistrationComponent } from './item-registration/item-registration.component';

const routes: Routes = [
  {
    path: '', component: ItemRegistrationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRegistrationRoutingModule { }
