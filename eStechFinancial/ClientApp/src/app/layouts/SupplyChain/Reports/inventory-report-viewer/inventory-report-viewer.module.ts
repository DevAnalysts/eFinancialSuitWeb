import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryReportViewerRoutingModule } from './inventory-report-viewer-routing.module';
import { InventoryReportViewerComponent } from './inventory-report-viewer/inventory-report-viewer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    InventoryReportViewerRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelect2Module,
    SpinnerModule
  ],
  
  declarations: [InventoryReportViewerComponent]
})
export class InventoryReportViewerModule { }
