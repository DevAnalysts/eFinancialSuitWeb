import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { VehicalRegistrationRoutingModule } from './vehical-registration-routing.module';
import { VehicalRegistrationComponent } from './vehical-registration.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TextMaskModule } from 'angular2-text-mask';
import { DndModule } from 'ng2-dnd';


@NgModule({
  
  imports: [

   CommonModule,
    NgSelect2Module,
    DirectiveModule,
    FormsModule,  
    SharedPipesModule,
    NgbModule,
    VehicalRegistrationRoutingModule,

    NgxPaginationModule,
    AngularMultiSelectModule,
    Ng2SearchPipeModule,
    TextMaskModule,
    AngularMyDatePickerModule ,
    DndModule.forRoot(),
    SpinnerModule
  ],
  declarations: [VehicalRegistrationComponent],
})
export class VehicalRegistrationModule { }
