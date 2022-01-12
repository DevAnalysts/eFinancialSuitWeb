import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamilyInformationComponent } from './family-information.component';

const routes: Routes = [
  {
    path: '', component: FamilyInformationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyInformationRoutingModule { }
