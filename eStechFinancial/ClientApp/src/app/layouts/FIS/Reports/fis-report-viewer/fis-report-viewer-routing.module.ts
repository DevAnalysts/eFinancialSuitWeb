import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FISReportViewerComponent } from './fis-report-viewer.component';
 

const routes: Routes = [
  {
    path: '', component: FISReportViewerComponent
  
}
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class FISReportViewerRoutingModule { }
