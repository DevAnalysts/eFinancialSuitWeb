import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { PRMBankBranch } from '../../../../shared';

@Injectable()
export class PRMBankBranchService {


  URL = 'api/PRMBankBranch';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getBranches
  getBranches(brancH_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBranches?brancH_CODE=" + brancH_CODE + "");
  }
  //getBanks
  getBanks() {
    return this.httpRepository.getData(this.URL + "/getBanks");
  }
  //getCity
  getCity() {
    return this.httpRepository.getData(this.URL + "/getCity")
  }
  //getDistrict
  getRegion(CITY_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getRegion?CITY_CODE=" + CITY_CODE)
  }
  //getProvince
  getProvince(PROVINCE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getProvince?PROVINCE_CODE=" + PROVINCE_CODE)
  }
  //getCountry
  getCountry(Country_id: any) {
    return this.httpRepository.getData(this.URL + "/getCountry?Country_id=" + Country_id)
  }
  //getAddressDetails
  getAddressDetails(BRANCH_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getAddressDetails?BRANCH_CODE=" + BRANCH_CODE)
  }
  //getDetailsByID
  getDetailsByID(brancH_CODE: Number): Observable<PRMBankBranch> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?brancH_CODE=" + brancH_CODE + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //saveBranches
  saveBranches(bankBranch: any): Promise<any> {
    let body = JSON.stringify(bankBranch);
   // alert(body);
   return this.httpRepository.create(this.URL, bankBranch )
      .toPromise()
      .then(res => res.json() as PRMBankBranch)
      .catch()
  }
  //updateBranches
  updateBranches(bankBranch: any): Promise<any> {
    let body = JSON.stringify(bankBranch);
  //  alert(body);
    return this.httpRepository.update(this.URL, bankBranch )
      .toPromise()
      .then(res => res.json() as PRMBankBranch)
      .catch()
  }
  //handleError
  private handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type) {
     // console.log(serverError);
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }
    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }
}
