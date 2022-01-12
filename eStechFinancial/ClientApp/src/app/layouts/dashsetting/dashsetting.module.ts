import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashSettingRoutingModule } from './dashsetting-routing.module';
import { DashSettingComponent } from './dashsetting.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    DashSettingRoutingModule,
  ],
  declarations: [DashSettingComponent]
})
export class DashSettingModule { }
