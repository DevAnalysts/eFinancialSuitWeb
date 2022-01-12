import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule } from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { FiscalPeriodRoutingModule } from './fiscal-period-routing.module';
import { FiscalPeriodComponent } from './fiscal-period/fiscal-period.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    SharedPipesModule,
    NgbModule,  
    FiscalPeriodRoutingModule,
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [FiscalPeriodComponent]
})
export class FiscalPeriodModule { }
