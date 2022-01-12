import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AssetPIRoutingModule } from './asset-pi-routing.module';
import { AssetPIComponent  } from './asset-pi.component';
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
    AssetPIRoutingModule,
    
    NgxPaginationModule,
    SpinnerModule
  ],

  declarations: [AssetPIComponent ]
})
export class AssetPIModule { }
