import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelect2Module } from 'ng-select2';

import { PRMReportViewerRoutingModule } from './prmreport-viewer-routing.module';
import { PRMReportViewerComponent } from './prmreport-viewer/prmreport-viewer.component';

@NgModule({
  declarations: [PRMReportViewerComponent],
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    PRMReportViewerRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelect2Module,
    SpinnerModule
  ]

})
export class PRMReportViewerModule { }
