import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicalRegistrationComponent } from '../vehical-registration/vehical-registration.component';

const routes: Routes = [
  {
    path: '', component: VehicalRegistrationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicalRegistrationRoutingModule { }
