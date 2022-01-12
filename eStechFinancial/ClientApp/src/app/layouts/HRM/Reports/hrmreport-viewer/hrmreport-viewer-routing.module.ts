import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HRMReportViewerComponent } from './hrmreport-viewer/hrmreport-viewer.component';

const routes: Routes = [
  {
    path: '', component: HRMReportViewerComponent, children: [
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRMReportViewerRoutingModule { }
