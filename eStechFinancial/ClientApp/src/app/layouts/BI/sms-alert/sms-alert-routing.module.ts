import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsAlertComponent } from './sms-alert.component';

const routes: Routes = [
  {
    path: '', component: SmsAlertComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsAlertRoutingModule { }
