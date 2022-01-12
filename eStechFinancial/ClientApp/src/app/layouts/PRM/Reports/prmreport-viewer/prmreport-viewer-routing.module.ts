import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PRMReportViewerComponent } from './prmreport-viewer/prmreport-viewer.component';

const routes: Routes = [
  {
    path: '', component: PRMReportViewerComponent, children: [
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PRMReportViewerRoutingModule { }
