import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewReportComponent } from './view-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { ViewReportRoutingModule } from './view-report-routing.module';


@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    ViewReportRoutingModule,
    SpinnerModule
  ],
 
  
  declarations: [ViewReportComponent]
})
export class ViewReportModule { }
