import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryJournalVoucherComponent } from './salary-journalvoucher.component';

const routes: Routes = [
  {
    path: '', component: SalaryJournalVoucherComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryJournalVoucherRoutingModule { }
