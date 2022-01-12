import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackingComponent } from './packing/packing.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { SharedPipesModule, DirectiveModule, SpinnerModule } from '../../../../shared';
import { PackingRoutingModule } from './packing-roution.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  declarations: [PackingComponent],
  imports: [
    CommonModule,
    NgSelect2Module, 
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    PackingRoutingModule, 
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SpinnerModule
  ]
})
export class PackingModule { }
