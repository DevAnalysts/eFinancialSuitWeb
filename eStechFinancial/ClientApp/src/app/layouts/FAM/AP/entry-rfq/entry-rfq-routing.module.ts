import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryRFQComponent } from './entry-rfq.component';

const routes: Routes = [
  {
    path: '', component: EntryRFQComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRFQRoutingModule { }
