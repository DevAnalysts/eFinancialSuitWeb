import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryReportViewerComponent } from './inventory-report-viewer/inventory-report-viewer.component';

const routes: Routes = [
  {
    path: '', component: InventoryReportViewerComponent, children: [
      { path: '', loadChildren: '../view-report/view-report.module#ViewReportModule' }
    ]   
}
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class InventoryReportViewerRoutingModule { }
