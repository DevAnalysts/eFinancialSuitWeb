import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRMReportViewerComponent } from './crm-report-viewer/crm-report-viewer.component';

const routes: Routes = [
  {
    path: '', component: CRMReportViewerComponent, children: [
      { path: '', loadChildren: '../view-report/view-report.module#ViewReportModule' }
    ]   
}
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class CRMReportViewerRoutingModule { }
