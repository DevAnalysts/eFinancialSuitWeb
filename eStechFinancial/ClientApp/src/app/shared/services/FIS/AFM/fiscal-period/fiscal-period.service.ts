import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { fiscalPeriod } from '../../../../../shared';

@Injectable()
export class FiscalPeriodService {

  URL = 'api/FiscalPeriod';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getFiscalPeriod
  getFiscalPeriod(id:any) {
    return this.httpRepository.getData(this.URL + "/getFiscalPeriod?id=" + id + "");
  }
  //getFiscalYear
  getFiscalYear(starT_DT: any, enD_DT: any) {
    return this.httpRepository.getData(this.URL + "/getFiscalYear?starT_DT=" + starT_DT + "&enD_DT=" + enD_DT + "");
  }
  //getDayClose
  getDayClose(enD_DT: any) {
    return this.httpRepository.getData(this.URL + "/getDayClose?enD_DT=" + enD_DT +"" );
  }
  //saveFiscalPeriod
  saveFiscalPeriod(period: any): Promise<any> {
    let body = JSON.stringify(period);
    //alert(body);
     return this.httpRepository.create(this.URL, period )
      .toPromise()
      .then(res => res.json() as fiscalPeriod)
      .catch()
  }
}
