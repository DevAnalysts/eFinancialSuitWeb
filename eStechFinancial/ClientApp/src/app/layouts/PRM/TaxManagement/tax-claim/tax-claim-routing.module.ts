import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxClaimComponent } from './tax-claim.component';

const routes: Routes = [
  {
    path: '', component: TaxClaimComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxClaimRoutingModule { }
