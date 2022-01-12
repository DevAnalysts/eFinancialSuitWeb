export class Columns {
  
  constructor(public title?: string, public dataKey?: any, public isvisible?: any) {
    if (isvisible == null) {
      isvisible = 0;
    }
  }
}
