import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule } from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { FiscalYearRoutingModule } from './fiscal-year-routing.module';
import { FiscalYearComponent } from './fiscal-year/fiscal-year.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,  
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,  
    SharedPipesModule,
    NgbModule,   
    //
    FiscalYearRoutingModule,
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [FiscalYearComponent]
})
export class FiscalYearModule { }
