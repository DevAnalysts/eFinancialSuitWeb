import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SRMReportViewerComponent } from './srm-report-viewer/srm-report-viewer.component';

const routes: Routes = [
  {
    path: '', component: SRMReportViewerComponent, children: [
      { path: '', loadChildren: '../view-report/view-report.module#ViewReportModule' }
    ]   
}
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class SRMReportViewerRoutingModule { }
