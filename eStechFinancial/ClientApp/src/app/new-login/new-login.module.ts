import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './new-login-routing.module';
import { NewLoginComponent } from './new-login.component';


@NgModule({
  imports: [CommonModule, LoginRoutingModule, FormsModule],
    declarations: [NewLoginComponent]
})
export class LoginModule {}
