import { FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAMReportCriteriaRoutingModule } from './fam-report-criteria-routing.module';
import { FAMReportCriteriaComponent } from './fam-report-criteria/fam-report-criteria.component';
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
    FAMReportCriteriaRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelect2Module,
    SpinnerModule
  ],
  
  declarations: [FAMReportCriteriaComponent]
})
export class FAMReportCriteriaModule { }


