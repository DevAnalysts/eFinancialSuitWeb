import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TextMaskModule } from 'angular2-text-mask'; 
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { StockTransferRoutingModule } from './stock-transfer-routing.module';
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
    StockTransferRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    TextMaskModule,
    SpinnerModule
  ],
  declarations: [StockTransferComponent]
})
export class StockTransferModule { }
