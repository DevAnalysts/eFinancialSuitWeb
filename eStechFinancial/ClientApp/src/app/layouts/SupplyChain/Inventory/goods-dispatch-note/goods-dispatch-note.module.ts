import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { GoodsDispatchNoteRoutingModule } from './goods-dispatch-note-routing.module';
import { GoodsDispatchNoteComponent } from './goods-dispatch-note/goods-dispatch-note.component';
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
    GoodsDispatchNoteRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],
  declarations: [GoodsDispatchNoteComponent]
})
export class GoodsDispatchNoteModule { }
