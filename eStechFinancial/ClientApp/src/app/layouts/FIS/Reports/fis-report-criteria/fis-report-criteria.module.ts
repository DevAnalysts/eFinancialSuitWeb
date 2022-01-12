import { FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FISReportCriteriaRoutingModule } from './fis-report-criteria-routing.module';
import { FISReportCriteriaComponent } from './fis-report-criteria/fis-report-criteria.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
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
    FISReportCriteriaRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelect2Module,
    SpinnerModule
  ],
  
  declarations: [FISReportCriteriaComponent]
})
export class FISReportCriteriaModule { }


