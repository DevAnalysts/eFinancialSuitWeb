import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleOrderContractComponent } from './sale-order-contract/sale-order-contract.component';
import { FormsModule } from '@angular/forms';
import { SaleOrderContractRoutingModule } from './sale-order-contract-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [SaleOrderContractComponent],
  imports: [
    CommonModule,
    NgSelect2Module,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    SaleOrderContractRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    TextMaskModule,
    SpinnerModule
  ]
})
export class SaleOrderContractModule { }
