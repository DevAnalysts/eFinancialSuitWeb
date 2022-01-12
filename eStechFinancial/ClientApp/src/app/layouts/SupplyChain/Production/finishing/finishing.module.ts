import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinishingComponent } from './finishing/finishing.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { SharedPipesModule, DirectiveModule, SpinnerModule } from '../../../../shared';
import { FinishingRoutingModule } from './finisging-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  declarations: [FinishingComponent],
  imports: [
    CommonModule,
    NgSelect2Module, 
    DirectiveModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedPipesModule,
    NgbModule,
    FinishingRoutingModule, 
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SpinnerModule
  ]
})
export class FinishingModule { }
