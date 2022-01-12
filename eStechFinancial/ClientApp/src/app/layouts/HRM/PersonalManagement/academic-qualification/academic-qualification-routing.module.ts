import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcademicQualificationComponent } from './academic-qualification.component';

const routes: Routes = [
  {
    path: '', component: AcademicQualificationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicQualificationRoutingModule { }
