import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared'
import { DayEndRoutingModule } from './day-end-routing.module';
import { DayEndComponent } from './day-end/day-end.component';
import { NgxPaginationModule } from 'ngx-pagination';
//import { IAngularMyDpOptions } from 'angular-mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    DayEndRoutingModule,
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [DayEndComponent]
})
export class DayEndModule { }
