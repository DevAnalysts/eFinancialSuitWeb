import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FAMReportCriteriaComponent } from './fam-report-criteria/fam-report-criteria.component';


const routes: Routes = [
  {
    path: '', component: FAMReportCriteriaComponent,
    children: [
      {
        path: '', loadChildren: '../fam-report-viewer/fam-report-viewer.module#FAMReportViewerModule'
      }
    ] 
}];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class FAMReportCriteriaRoutingModule { }
