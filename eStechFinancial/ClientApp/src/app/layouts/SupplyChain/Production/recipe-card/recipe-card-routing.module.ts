import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';

const routes: Routes = [{
  path: '', component: RecipeCardComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeCardRoutingModule { }
