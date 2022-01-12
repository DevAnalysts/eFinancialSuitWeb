import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule, SpinnerModule} from '../../../../shared';
import { ItemRegistrationRoutingModule } from './item-registration-routing.module';
import { ItemRegistrationComponent } from './item-registration/item-registration.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  imports: [
    CommonModule,
    NgSelect2Module,
    DirectiveModule,
    FormsModule,  
    SharedPipesModule,
    NgbModule,
    ItemRegistrationRoutingModule,
    
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SpinnerModule
  ],
  declarations: [ItemRegistrationComponent]
})
export class ItemRegistrationModule { }
