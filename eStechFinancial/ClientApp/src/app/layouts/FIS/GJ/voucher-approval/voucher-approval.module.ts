import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { NgSelect2Module } from 'ng-select2';
import { VoucherApprovalRoutingModule } from './voucher-approval-routing.module';
import { VoucherApprovalComponent } from './voucher-approval/voucher-approval.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    NgSelect2Module,
    DirectiveModule,
    FormsModule,
    SharedPipesModule,
    NgbModule,   
    VoucherApprovalRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [VoucherApprovalComponent]
})
export class VoucherApprovalModule { }
