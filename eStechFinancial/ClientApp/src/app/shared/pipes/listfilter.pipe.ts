import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'listFilter'
})
export class listFilterPipe implements PipeTransform {

  transform(list: any[], value: string) {

    // If there's a value passed (male or female) it will filter the list otherwise it will return the original unfiltered list. 
    return value ? list.filter(item => item.gender === value) : list;
         
  }
}
