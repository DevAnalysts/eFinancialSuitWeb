
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Suppliers } from '../../../../../shared';

@Injectable()
export class SupplierService {

  URL = 'api/Supplier';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getSuppliers
  getSuppliers(supplier_Name:any) {
    return this.httpRepository.getData(this.URL + "/getSuppliers?supplier_Name=" + supplier_Name + "")
  }
  //getcategories
  getCategories() {
    return this.httpRepository.getData(this.URL + "/getCategories")
  }
  //saveSupplier
  saveSupplier(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
  //  alert(body);
   return this.httpRepository.create(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as Suppliers)
      .catch()
  }
  //updateSupplier
  updateSupplier(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
    // alert(body);
    return this.httpRepository.update(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as Suppliers)
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
  getDetailsByID(supplier_ID: Number): Observable<Suppliers> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?supplier_ID=" + supplier_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getAddressByID
  getAddressByID(supplier_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressByID?supplier_ID=" + supplier_ID)
  }
  //getCity
  getArea() {
    return this.httpRepository.getData(this.URL + "/getArea")
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
