import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PressingComponent } from './pressing/pressing.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { SharedPipesModule, DirectiveModule, SpinnerModule } from '../../../../shared';
import { PressingRoutingModule } from './pressing-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  declarations: [PressingComponent],
  imports: [
    CommonModule,
    NgSelect2Module, 
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    PressingRoutingModule,  
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SpinnerModule
  ]
})
export class PressingModule { }
