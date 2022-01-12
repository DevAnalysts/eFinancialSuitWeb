import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { DepreciationVoucherRoutingModule } from './depreciation-voucher-routing.module';
import { DepreciationVoucherComponent } from './depreciation-voucher.component';
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
    DepreciationVoucherRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [DepreciationVoucherComponent]
})
export class DepreciationVoucherModule { }
