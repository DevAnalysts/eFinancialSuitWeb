import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfessionalQualificationComponent } from './professional-qualification.component';

const routes: Routes = [
  {
    path: '', component: ProfessionalQualificationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalQualificationRoutingModule { }
