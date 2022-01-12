import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { ReportParam, SharedParams } from '../../index';
@Injectable()
export class FAMReportService {

  url = 'api/FAMReportviewer'; 
   constructor(private httpRepository: RepositoryHttpService) { }

  setReportParams(json: SharedParams): Promise<any> {
    let body = JSON.stringify(json);
    console.log(JSON.stringify(json));

    return this.httpRepository.updateBlob(this.url, body)
      .toPromise()
      .then(res => res as any)
      .catch()
  }
  getReports() {
    return this.httpRepository.getData(this.url + '/reports');
  }
}
true
