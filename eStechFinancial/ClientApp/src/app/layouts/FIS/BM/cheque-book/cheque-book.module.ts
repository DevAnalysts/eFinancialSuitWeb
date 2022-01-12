import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { ChequeBookRoutingModule } from './cheque-book-routing.module';
import { ChequeBookComponent } from './cheque-book/cheque-book.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    SharedPipesModule,
    NgbModule, 
    ChequeBookRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [ChequeBookComponent]
})
export class ChequeBookModule { }
