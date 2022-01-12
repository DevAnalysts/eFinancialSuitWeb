import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FISReportCriteriaComponent } from './fis-report-criteria/fis-report-criteria.component';


const routes: Routes = [
  {
    path: '', component: FISReportCriteriaComponent,
    children: [
      {
        path: '', loadChildren: '../fis-report-viewer/fis-report-viewer.module#FISReportViewerModule'
      }
    ] 
}];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class FISReportCriteriaRoutingModule { }
