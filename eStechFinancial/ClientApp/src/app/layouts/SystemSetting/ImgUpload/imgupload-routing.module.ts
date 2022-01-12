import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImgUploadComponent } from './imgupload.component';

const routes: Routes = [{
  path: '', component: ImgUploadComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImgUploadRoutingModule { }
