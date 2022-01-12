import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookRegistrationComponent } from './book-registration.component';

const routes: Routes = [
  {
    path: '', component: BookRegistrationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRegistrationRoutingModule { }
