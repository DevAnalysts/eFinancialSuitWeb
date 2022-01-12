
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { taxRate } from '../../../../shared';

@Injectable()
export class TaxRateService {

  URL = 'api/TaxRate';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(value:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?value=" + value + "")
  }

  //getTaxAgency
  getTaxAgency() {
    return this.httpRepository.getData(this.URL + "/getTaxAgency")
  }

  //getTaxRate
  getTaxRate() {
    return this.httpRepository.getData(this.URL + "/getTaxRate")
  }
  //saveData
  saveData(taxrate: any): Promise<any> {
    let body = JSON.stringify(taxrate);

     return this.httpRepository.create(this.URL, taxrate )
      .toPromise()
      .then(res => res.json() as taxRate)
      .catch()
  }
  //updateData
  updateData(taxRate: any): Promise<any> {
    let body = JSON.stringify(taxRate);
    // alert(body);
    return this.httpRepository.update(this.URL, taxRate )
      .toPromise()
      .then(res => res.json() as taxRate)
      .catch()
  }
  //IfExists
  IfExists(supplier_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?supplier_ID=" + supplier_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
      return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //cellExists
  cellExists(cell: any) {
    return this.httpRepository.getData(this.URL + "/cellExists?cell=" + cell + "")
  }
  //contactCellExists
  contactCellExists(number: any) {
    return this.httpRepository.getData(this.URL + "/contactCellExists?number=" + number + "")
  }
  //emailExists
  emailExists(email: any) {
    return this.httpRepository.getData(this.URL + "/emailExists?email=" + email + "")
  }
  //getDetailsByID
  getDetailsByID(ID: Number): Observable<taxRate> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getGroupGridDetailsByID
  getGroupGridDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getGroupGridDetailsByID?ID=" + ID + "")
  }
  //getAddressByID
  getAddressByID(supplier_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressByID?supplier_ID=" + supplier_ID)
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
  //getCustomer
  getCustomer() {
    return this.httpRepository.getData(this.URL + "/getCustomer")
  }
  saveLink(SID: any,CID: any) {
    return this.httpRepository.getData(this.URL + "/saveLink?SID=" + SID + "&CID=" + CID +"");
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
