import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import {DirectiveModule, SpinnerModule} from '../../../../shared';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer/customer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomerDiscountComponent } from '../customer-discount/customer-discount.component';
import { NgxMaskModule } from 'ngx-mask'; 
 
@NgModule({
  imports: [
    CommonModule,
    NgSelect2Module,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    NgbModule, 
    CustomerRoutingModule,
    NgxPaginationModule,
    TextMaskModule, 
    SpinnerModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [CustomerComponent,CustomerDiscountComponent]
})
export class CustomerModule { }

