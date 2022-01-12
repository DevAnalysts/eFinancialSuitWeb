import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { BankAccountRoutingModule } from './bank-account-routing.module';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    SharedPipesModule,
    NgbModule,   
    BankAccountRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [BankAccountComponent]
})
export class BankAccountModule { }
