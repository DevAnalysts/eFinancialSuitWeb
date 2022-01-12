import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared'
import { ChartOfAccountsRoutingModule } from './chartofaccount-routing.module';
import { ChartOfAccountsComponent } from './chartofaccount/chartofaccount.component';
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
    ChartOfAccountsRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [ChartOfAccountsComponent]
})
export class ChartOfAccountsModule { }
