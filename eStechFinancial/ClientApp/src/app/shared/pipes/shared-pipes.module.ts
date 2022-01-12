import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from './search-filter.pipe';
import { KeysPipe } from './keys.pipe';
import { GroupByPipe } from './groupby.pipe';
import { SearchPipe } from './search.pipe';
import { listFilterPipe } from './listfilter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SearchFilterPipe, KeysPipe, GroupByPipe, SearchPipe, listFilterPipe],
  exports: [SearchFilterPipe, KeysPipe, GroupByPipe, SearchPipe, listFilterPipe],
})
export class SharedPipesModule { }
