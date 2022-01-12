import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { SampleRequestComponent } from './sample-request.component';

const routes: Routes = [{
  path: '', component: SampleRequestComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleRequestRoutingModule { }
