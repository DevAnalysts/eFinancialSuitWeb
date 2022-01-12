import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisciplinaryActionComponent } from './disciplinary-action.component';

const routes: Routes = [
  {
    path: '', component: DisciplinaryActionComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisciplinaryActionRoutingModule { }
