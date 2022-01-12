import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportTemplateComponent } from './ReportTemplate.component';

const routes: Routes = [{
  path: '', component: ReportTemplateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportTemplateRoutingModule { }
  