import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRetailInvoiceListRoutingModule } from './purchase-retail-invoice-list-routing.module';
import { PurchaseRetailInvoiceListComponent } from './purchase-retail-invoice-list/purchase-retail-invoice-list.component';
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
    PurchaseRetailInvoiceListRoutingModule,
    NgxPaginationModule,
    
    Ng2SearchPipeModule,
    SpinnerModule
  ],
  declarations: [PurchaseRetailInvoiceListComponent]
})
export class PurchaseRetialInvoiceListModule { }
