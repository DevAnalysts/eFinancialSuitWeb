import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { AssetApprovalRoutingModule } from './asset-approval-routing.module';
import { AssetApprovalComponent } from './asset-approval.component';
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
    AssetApprovalRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [AssetApprovalComponent]
})
export class AssetApprovalModule { }
