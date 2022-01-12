import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { fiscalYear } from '../../../../../shared';

@Injectable()
export class FiscalYearService {

  URL = 'api/FiscalYear';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getFiscalYear
  getFiscalYear(id: any) {
    return this.httpRepository.getData(this.URL + "/getFiscalYear?id=" + id + "")
  }
  //getFiscalYearByID
  getFiscalYearByID(fiN_YR: any): Observable<fiscalYear> {
    return this.httpRepository.getData(this.URL + "/getFiscalYearByID?fiN_YR=" + fiN_YR + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getNextFiscalYear
  getNextFiscalYear() {
    return this.httpRepository.getData(this.URL + "/getNextFiscalYear")
  }
  //getCurrentFiscalYear
  getCurrentFiscalYear() {
    return this.httpRepository.getData(this.URL + "/getCurrentFiscalYear")
  }
  //IfExists
  IfExists(starT_DT: any, enD_DT: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?starT_DT=" + starT_DT + "&enD_DT=" + enD_DT + "")
  }
  //getDetailsByID
  getDetailsByID(fiN_YR: Number): Observable<fiscalYear> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?fiN_YR=" + fiN_YR + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getFiscalYearDetail
  getFiscalYearDetail(fiN_YR: any, ID: any) {
    return this.httpRepository.getData(this.URL + "/getFiscalYearDetail?fiN_YR=" + fiN_YR + "&ID=" + ID + "")
  }
  //transferProvBalance
  transferProvBalance(fiN_YR: any) {
    return this.httpRepository.getData(this.URL + "/transferProvBalance?fiN_YR=" + fiN_YR + "")
  }
  //closeCurrentFisYear
  closeCurrentFisYear(fiN_YR: any, ID: any) {
    return this.httpRepository.getData(this.URL + "/closeCurrentFisYear?fiN_YR=" + fiN_YR + "&ID=" + ID + "")
  }
  //getDayCloseStatus
  getDayCloseStatus(starT_DT: any, enD_DT: any, isClosed: any) {
    return this.httpRepository.getData(this.URL + "/getDayCloseStatus?starT_DT=" + starT_DT + "&enD_DT=" + enD_DT + "&isClosed=" + isClosed + "")
  }
  //saveFiscalYear
  saveFiscalYear(year: any): Promise<any> {
    let body = JSON.stringify(year);
    //   alert(body);
     return this.httpRepository.create(this.URL, year )
      .toPromise()
      .then(res => res.json() as fiscalYear)
      .catch()
  }
  //updateFiscalYear
  updateFiscalYear(year: any): Promise<any> {
    let body = JSON.stringify(year);
    //  alert(body);
    return this.httpRepository.update(this.URL, year )
      .toPromise()
      .then(res => res.json() as fiscalYear)
      .catch()
  }
  //handleError
  private handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type) {
      console.log(serverError);
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }
    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }

}
