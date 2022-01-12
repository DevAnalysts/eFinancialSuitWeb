import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, DirectiveModule, SpinnerModule } from '../../../../shared';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { NgSelect2Module } from 'ng-select2';
import { OpeningBalanceRoutingModule } from './opening-balance-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';

@NgModule({
  declarations: [OpeningBalanceComponent],
  imports: [
    CommonModule,
    AngularMyDatePickerModule ,
    NgSelect2Module,
    DirectiveModule,
    FormsModule,
    SharedPipesModule,
    NgbModule,   
    OpeningBalanceRoutingModule,
    NgxPaginationModule,
    SpinnerModule
  ]
})
export class OpeningBalanceModule { }
