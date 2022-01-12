
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { BankSalary } from '../../../shared';
import { ok } from 'assert';


@Injectable()
export class BankSalaryService {

  URL = 'api/BankSalary';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getLeaveType
  getPack_Allow() {
    return this.httpRepository.getData(this.URL + "/getPackageAllowance")
  }
  //getbank
  getbank() {
    return this.httpRepository.getData(this.URL + "/getbank")
  }

  //getbank
  getbranchname() {
    return this.httpRepository.getData(this.URL + "/getBranchname")
  }
  // GET ACCOUNT TITLE
  getAccountTitle() {
    return this.httpRepository.getData(this.URL + "/getAccountTitle")
  }
  //GET ACCOUNT NUMBER
  getAccountNO(accountTite: any) {
    return this.httpRepository.getData(this.URL + "/getAccountNum?accountTitle=" + accountTite + "")
  }

  //--------------------------------- SIGNATORY DROPDON SERVICE ------------------------------
  //getSignatory L 1
  getSignL1() {
    return this.httpRepository.getData(this.URL + "/getSignatoryL1")
  }
  //getSignatory R 1
  getSignR1() {
    return this.httpRepository.getData(this.URL + "/getSignatoryR1")
  }
  //getSignatory L 2
  getSignL2() {
    return this.httpRepository.getData(this.URL + "/getSignatoryL2")
  }
  //getSignatory Right 2
  getSignR2() {
    return this.httpRepository.getData(this.URL + "/getSignatoryR2")
  }

  //-------------------------------------END -------------------------------------------------
  //getDetailsByID
  getDetailsByID(A_Pack: any) {
    //alert(A_Pack);
    return this.httpRepository.getData(this.URL + "/getDetailsByID?P_Allowance=" + A_Pack)
    
  }

  ////  //saveHSubCategory
  saveSignatory(Bank_Signatory: any): Promise<any> {
    let body = JSON.stringify(Bank_Signatory);
  //  alert(body);
    return this.httpRepository.create(this.URL, Bank_Signatory )
      .toPromise()
      .then(res => res.json() as BankSalary)
      .catch()
  }


  //getSession
  getSession(value: any): string {
    if (typeof (Storage) !== 'undefined') {

      if (sessionStorage.getItem(value)) {
        return sessionStorage.getItem(value);
      }

      return 'undefined';
    }
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
