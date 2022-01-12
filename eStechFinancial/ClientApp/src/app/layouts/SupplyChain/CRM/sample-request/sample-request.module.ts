import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { SampleRequestRoutingModule } from './sample-request-routing.module'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { TextMaskModule } from 'angular2-text-mask'; 
import { NgxMaskModule } from 'ngx-mask';
import { SampleRequestComponent } from './sample-request.component';
 

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
    SampleRequestRoutingModule,
    NgxPaginationModule,
    TextMaskModule,
    
    NgxMaskModule.forRoot(),
    SpinnerModule
  ],
  declarations: [SampleRequestComponent]
})
export class SampleRequestModule { }

