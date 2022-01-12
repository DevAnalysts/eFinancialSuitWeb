import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRetialInvoiceEditRoutingModule } from './purchase-retail-invoice-edit-routing.module';
import { PurchaseRetialInvoiceEditComponent } from './purchase-retail-invoice-edit/purchase-retail-invoice-edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


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
    PurchaseRetialInvoiceEditRoutingModule,
    NgxPaginationModule,
    
    Ng2SearchPipeModule,
    SpinnerModule
  ],
  declarations: [PurchaseRetialInvoiceEditComponent]
})
export class PurchaseRetialInvoiceEditModule { }
