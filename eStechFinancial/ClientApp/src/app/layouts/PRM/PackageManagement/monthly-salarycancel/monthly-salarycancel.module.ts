import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { MonthlySalaryCancelRoutingModule } from './monthly-salarycancel-routing.module';
import { MonthlySalaryCancelComponent } from './monthly-salarycancel.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    NgSelect2Module,
    DirectiveModule,
    FormsModule,  
    SharedPipesModule,
    NgbModule,
    MonthlySalaryCancelRoutingModule,
    
    NgxPaginationModule,
    AngularMultiSelectModule,
    Ng2SearchPipeModule,
    TextMaskModule,
    SpinnerModule

  ],
  declarations: [MonthlySalaryCancelComponent]
})
export class MonthlySalaryCancelModule { }
