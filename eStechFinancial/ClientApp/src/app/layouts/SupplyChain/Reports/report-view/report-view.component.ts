import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportParam, ReportViewerService, DataService, Columns } from '../../../../shared/index';
@Component({
  selector: 'report-view',
    templateUrl: './report-view.component.html',

})

export class ReportViewComponent implements OnInit {
 
  rows: any[];
  columns: Columns[];
  reportType: any = 1;
  message: any = '';
    constructor(private service: ReportViewerService, private dataserv: DataService ) {
    }
    ngOnInit(): void {
      this.reportType = this.dataserv.currentreportType.subscribe(rtype => this.reportType = rtype);
      this.dataserv.currentrows.subscribe(rw => { this.rows = rw; });
      this.dataserv.currentcolumns.subscribe(cl => { this.columns =cl; });     
    } 
    getHeading(): any {
      let sum = 0;
      let hdn = 0;
      // console.log(dataKey + "-----" + this.columns[i]['column_IsTotal']);
      if (this.columns != null) {
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i]['column_IsTotal'] == true) {
            sum = i - 1;
            break;
          }

        }
        if (this.columns[sum]['column_IsVisible'] == false) {
          console.log(this.columns[sum]['column_Sort']);
          for (let x = 0; x < sum; x++) {
            if (this.columns[x]['column_IsVisible'] == false) {

              sum = x - 1;
              break;
            }
          }
        }
      }
      return sum;

    }


    getColSpan(): any {
      let sum = 0;
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i]['column_IsVisible'] == true) {
          sum += 1;
          if (this.columns[i]['column_IsTotal'] == true) {
            break;
          }
        }
      }
      return sum;
    }

    getSum(arr: Array<any>, dataKey: any): any {
      let sum = 0;
      if (arr != null) {
        for (let i = 0; i < arr.length; i++) {
          sum += parseFloat(arr[i][dataKey]);
        }
      }
      return sum.toFixed(2);
    }

}
