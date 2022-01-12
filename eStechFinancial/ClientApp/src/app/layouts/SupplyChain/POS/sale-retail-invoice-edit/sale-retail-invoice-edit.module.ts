import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared'
import { SaleRetailInvoiceEditRoutingModule } from './sale-retail-invoice-edit-routing.module';
import { SaleRetailInvoiceEditComponent } from './sale-retail-invoice-edit/sale-retail-invoice-edit.component';
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
    SaleRetailInvoiceEditRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SpinnerModule
  ],
  declarations: [SaleRetailInvoiceEditComponent]
})
export class SaleRetailInvoiceEditModule { }
