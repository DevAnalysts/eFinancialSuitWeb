import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscReportViewerComponent } from './misc-report-viewer/misc-report-viewer.component';

const routes: Routes = [
  {
    path: '', component: MiscReportViewerComponent, children: [
      { path: '', loadChildren: '../view-report/view-report.module#ViewReportModule' }
    ]   
}
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class MiscReportViewerRoutingModule { }
