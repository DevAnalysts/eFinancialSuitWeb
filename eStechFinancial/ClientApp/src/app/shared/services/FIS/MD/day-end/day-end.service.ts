import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { dayEnd } from '../../../../../shared';

@Injectable()
export class DayEndService {

  URL = 'api/DayEnd';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(value: any, userPrivilegedOffice:any ) {
    return this.httpRepository.getData(this.URL + "/getGrid?value=" + value + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getDetail
  getDetail() {
    return this.httpRepository.getData(this.URL + "/getDetail")
  }
  //getCurrentDay
  getCurrentDay(userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/getCurrentDay?userCurrentOffice=" + userCurrentOffice + "")
  }
  //getCurrentCloseDay
  getCurrentCloseDay() {
    return this.httpRepository.getData(this.URL + "/getCurrentCloseDay")
  }
  //getBalance
  getBalance(poS_Day: any, userCurrentOffice:any) {
    return this.httpRepository.getData(this.URL + "/getBalance?poS_Day=" + poS_Day + "&userCurrentOffice=" + userCurrentOffice + "")
  }
  //getDetailsByID
  getDetailsByID(ID: any, userCurrentOffice :any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "&userCurrentOffice=" + userCurrentOffice + "")
  }

  //saveDayEnd
  saveDayEnd(dayEnd: any): Promise<any> {
    let body = JSON.stringify(dayEnd);
     return this.httpRepository.create(this.URL, dayEnd )
      .toPromise()
      .then(res => res.json() as dayEnd)
      .catch()
  }

}
