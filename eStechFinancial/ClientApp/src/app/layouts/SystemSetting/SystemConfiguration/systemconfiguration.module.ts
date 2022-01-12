import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule} from '../../../shared';
import { SystemConfigurationRoutingModule } from './systemconfiguration-routing.module';
import { SystemConfigurationComponent } from './systemconfiguration.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

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
    SystemConfigurationRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ],
  declarations: [SystemConfigurationComponent]
})
export class SystemConfigurationModule { }