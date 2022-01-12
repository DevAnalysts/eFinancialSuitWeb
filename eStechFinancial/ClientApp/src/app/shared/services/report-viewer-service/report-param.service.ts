import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReportParam, Columns, ReportMaster } from '../../index';

@Injectable()
export class DataService {

  private reportMaster = new BehaviorSubject<ReportMaster>(null);
  currentreportMaster = this.reportMaster.asObservable();

  private reportServer = new BehaviorSubject<any>('');
  currentreportServer = this.reportServer.asObservable();

  private reportSettings = new BehaviorSubject<any>(false);
  currentreportSettings = this.reportSettings.asObservable();

  private reportSP = new BehaviorSubject<any>('');
  currentreportSP = this.reportSP.asObservable();

  private reportType = new BehaviorSubject<any>(1);
  currentreportType = this.reportType.asObservable();

  private rows = new BehaviorSubject<any[]>([]);
  currentrows = this.rows.asObservable();

  private columns = new BehaviorSubject<Columns[]>([]);
  currentcolumns = this.columns.asObservable();



  private newparams = new BehaviorSubject<Array<ReportParam>>([]);
  currentParam = this.newparams.asObservable();

  constructor() { }

  changeReportParams(ReportParam: Array<ReportParam>) { 
    this.newparams.next(ReportParam); 
  }   
  changeRows(_rows: any[]) {
    this.rows.next(_rows);
  }
  changeColumns(_columns: Columns[]) {
    this.columns.next(_columns);
  }
  changereportType(_reportType: any) {
    this.reportType.next(_reportType);
  }
  changereportSettings(_reportSettings: any) {
    this.reportSettings.next(_reportSettings);
  } 
  changereportServer(_reportServer: any) {
    this.reportServer.next(_reportServer);
  }
  changereportSP(_reportSP: any) {
    this.reportSP.next(_reportSP);
  }
  changereportMaster(_reportMaster: ReportMaster) {
    this.reportMaster.next(_reportMaster);
  }
}
