import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { PurchaseReturnNoteRoutingModule } from './purchase-return-note-routing.module';
import { PurchaseReturnNoteComponent } from './purchase-return-note/purchase-return-note.component';
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
    PurchaseReturnNoteRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [PurchaseReturnNoteComponent]
})
export class PurchaseReturnNoteModule { }
