import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { IMEISearchRoutingModule } from './imei-search-routing.module'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { TextMaskModule } from 'angular2-text-mask';

import { NgxMaskModule } from 'ngx-mask';
import { IMEISearchComponent } from './imei-search/imei-search.component';
 

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
    IMEISearchRoutingModule,
    NgxPaginationModule,
    TextMaskModule,
    
    NgxMaskModule.forRoot(),
    SpinnerModule
  ],
  declarations: [IMEISearchComponent]
})
export class IMEISearchModule { }

