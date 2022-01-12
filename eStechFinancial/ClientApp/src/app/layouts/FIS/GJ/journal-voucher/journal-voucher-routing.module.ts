import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';

const routes: Routes = [
  {
  path: '', component: JournalVoucherComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalVoucherRoutingModule { }
