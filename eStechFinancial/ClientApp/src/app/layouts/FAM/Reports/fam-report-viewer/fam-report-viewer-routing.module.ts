import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FAMReportViewerComponent } from './fam-report-viewer.component';
 

const routes: Routes = [
  {
    path: '', component: FAMReportViewerComponent
  
}
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class FAMReportViewerRoutingModule { }
