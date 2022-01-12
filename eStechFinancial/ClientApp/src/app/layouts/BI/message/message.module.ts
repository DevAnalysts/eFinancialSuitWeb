import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { SharedPipesModule, DirectiveModule} from '../../../shared';
import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TextMaskModule } from 'angular2-text-mask';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
    imports: [
      CommonModule,
      NgSelect2Module,
      DirectiveModule,
      FormsModule,  
      SharedPipesModule,
      NgbModule,
      MessageRoutingModule,
      
      NgxPaginationModule,
      AngularMultiSelectModule,
      Ng2SearchPipeModule,
      TextMaskModule
  
    ],
    declarations: [MessageComponent]
  })
  export class MessageModule { }
  