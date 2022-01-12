import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { ChequeCancelRoutingModule } from './cheque-cancel-routing.module';
import { ChequeCancelComponent } from './cheque-cancel/cheque-cancel.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    DirectiveModule,
    FormsModule,
    SharedPipesModule,
    NgbModule, 
    ChequeCancelRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
,
  ],
  declarations: [ChequeCancelComponent]
})
export class ChequeCancelModule { }
