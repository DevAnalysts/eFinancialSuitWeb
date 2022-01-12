import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AssetWriteoffRoutingModule } from './asset-writeoff-routing.module';
import { AssetWriteoffComponent } from './asset-writeoff.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TextMaskModule } from 'angular2-text-mask';

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
    AssetWriteoffRoutingModule,
    NgxPaginationModule,
    
    TextMaskModule,
    SpinnerModule
  ],
  declarations: [AssetWriteoffComponent]
})
export class AssetWriteoffModule { }
