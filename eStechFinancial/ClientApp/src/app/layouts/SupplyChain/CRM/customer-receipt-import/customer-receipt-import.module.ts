import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared'
import { CustomerReceiptImportRoutingModule } from './customer-receipt-import-routing.module';
import { CustomerReceiptImportComponent } from './customer-receipt-import/customer-receipt-import.component';
import { NgxPaginationModule } from 'ngx-pagination';


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
    CustomerReceiptImportRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [CustomerReceiptImportComponent]
})
export class CustomerReceiptImportModule { }
