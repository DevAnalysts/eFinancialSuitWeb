import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyVahicleRoutComponent } from './daily-vahicle-rout/daily-vahicle-rout.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { DailyVahicleRoutRoutingModule } from './daily-vehicle-rout-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [DailyVahicleRoutComponent],
  imports: [
    CommonModule,
    NgSelect2Module,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    DailyVahicleRoutRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ]
})
export class DailyVehicleRoutModule { }
