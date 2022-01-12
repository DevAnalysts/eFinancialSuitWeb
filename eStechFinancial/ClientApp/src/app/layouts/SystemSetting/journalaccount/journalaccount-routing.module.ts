import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalAccountComponent } from './journalaccount.component';

const routes: Routes = [{
  path: '', component: JournalAccountComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalAccountRoutingModule { }
