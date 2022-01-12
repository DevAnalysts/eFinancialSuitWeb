import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainingTypeComponent } from './trainingtype.component';

const routes: Routes = [{
  path: '', component: TrainingTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingTypeRoutingModule { }
