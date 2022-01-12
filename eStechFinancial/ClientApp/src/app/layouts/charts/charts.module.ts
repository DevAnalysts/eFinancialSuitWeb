import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    Ng2Charts,
    ChartsRoutingModule,
    ],
    declarations: [ChartsComponent]
})
export class ChartsModule {}
