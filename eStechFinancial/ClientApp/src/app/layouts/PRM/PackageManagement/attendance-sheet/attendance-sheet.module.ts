import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { AttendanceSheetRoutingModule } from './attendance-sheet-routing.module';
import { AttendanceSheetComponent } from './attendance-sheet.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    NgSelect2Module,
    DirectiveModule,
    FormsModule,  
    SharedPipesModule,
    NgbModule,
    AttendanceSheetRoutingModule,
    
    NgxPaginationModule,
    AngularMultiSelectModule,
    Ng2SearchPipeModule,
    SpinnerModule
  ],
  declarations: [AttendanceSheetComponent]
})
export class AttendanceSheetModule { }
