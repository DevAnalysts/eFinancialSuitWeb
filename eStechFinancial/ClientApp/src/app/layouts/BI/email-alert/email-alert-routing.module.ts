import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailAlertComponent } from './email-alert.component';

const routes: Routes = [
  {
    path: '', component: EmailAlertComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailAlertRoutingModule { }
