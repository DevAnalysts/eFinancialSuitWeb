import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule } from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';

import { DailyExpenseVoucherRoutingModule } from './daily-expense-voucher-routing.module';
import { DailyExpenseVoucherComponent } from './daily-expense-voucher/daily-expense-voucher.component';

@NgModule({
  imports: [
    CommonModule,
    NgSelect2Module,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    NgxPaginationModule,
    DailyExpenseVoucherRoutingModule,
    SpinnerModule
  ],
  declarations: [DailyExpenseVoucherComponent]
})
export class DailyExpenseVoucherModule { }
