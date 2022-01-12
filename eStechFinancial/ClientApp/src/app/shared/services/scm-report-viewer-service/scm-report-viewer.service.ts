import { Injectable } from '@angular/core';
import { ReportParam,  SharedParams } from '../../index';
import { RepositoryHttpService } from '@services/repositoryHttp.service';

@Injectable()
export class SCMReportViewerService {

  url = 'api/SCMReportviewer';
     
     constructor(private httpRepository: RepositoryHttpService) { }
	 
    getColumns(rid: any, mid: any, parms: Array<ReportParam>) {
      console.log(parms);
      let body = JSON.stringify(parms);
      return this.httpRepository.getData(this.url + '/columns?rid=' + rid + '&mid=' + mid + '&json=' + body +'');
    }
    getsystemSettings(id: any) {

      return this.httpRepository.getData(this.url + '/systemSettings?id=' + id + '');
    }
    
    togglecolumns(uid: any,id:any,flag:any) {

      return this.httpRepository.getData(this.url + '/togglecolumns?uid=' + uid + '&id='+id+'&flag='+flag+'');
    }  
    getpagecolumns(rid: any,uid:any) {
      
      return this.httpRepository.getData(this.url + '/pagecolumns?rid=' + rid + '&uid=' + uid + '');
  }


    getSpData(spname: any, parms: Array<ReportParam>) {
      let body = JSON.stringify(parms);
      console.log(body);
      return this.httpRepository.getData(this.url + '/getspdata?spname=' + spname + '&json=' + body + '');
    }

    getRows(rid: any, mid: any, parms: Array<ReportParam>) {
     
      let body = JSON.stringify(parms);
      console.log(body);
      return this.httpRepository.getData(this.url + '/rows?rid=' + rid + '&mid=' + mid + '&json=' + body + '');
    }

  setReportParams( json: SharedParams): Promise<any> {
    let body = JSON.stringify(json);
    console.log(JSON.stringify(json));
 
    return this.httpRepository.updateBlob(this.url, body)
      .toPromise()
      .then(res=>res as any)
      .catch()
  }

    getdownloadExcel(rid: any, mid: any,name:any, parms: Array<ReportParam>) {

      let body = JSON.stringify(parms);
      console.log(body);
      return this.httpRepository.getData(this.url + '/downloadExcel?rid=' + rid + '&mid=' + mid + '&json=' + body + '&pageName='+name+'');
    }  
    getReports() {
      return this.httpRepository.getData(this.url + '/reports');
    }
    getDropDownList(TableName:any) {
      return this.httpRepository.getData(this.url + '/lists?TableName' + TableName);
    }

}
