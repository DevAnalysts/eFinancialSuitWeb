import { FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAMReportViewerComponent } from './fam-report-viewer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { FAMReportViewerRoutingModule } from './fam-report-viewer-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    FAMReportViewerRoutingModule,
    SpinnerModule
  ],
 
  
  declarations: [FAMReportViewerComponent]
})
export class FAMReportViewerModule { }
