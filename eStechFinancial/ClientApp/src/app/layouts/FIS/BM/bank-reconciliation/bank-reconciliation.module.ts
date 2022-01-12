import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { BankReconciliationRoutingModule } from './bank-reconciliation-routing.module';
import { BankReconciliationComponent } from './bank-reconciliation/bank-reconciliation.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    SharedPipesModule,
    NgbModule,   
    BankReconciliationRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [BankReconciliationComponent]
})
export class BankReconciliationModule { }
