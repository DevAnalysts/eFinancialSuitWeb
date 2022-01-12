import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Customers } from '../../../../../shared';

@Injectable()
export class CustomerService {
  getUnitPrice(item_Code: any, customerCategoryId: any, allowPriceList: any, userCurrentOffice: any, userCurrentWarehouse: any, customer_ID: any) {
    throw new Error('Method not implemented.');
  }

  URL = 'api/Customer';
  URL1 = 'https://nfs.punjab.gov.pk/Home/GetJosn?filter=';

  constructor(private httpRepository: RepositoryHttpService) { }


  //getProscribedPersonsList
  getProscribedPersonsList() {
  //  return this.httpRepository.getDatas(this.URL1)
    return this.httpRepository.getData(this.URL + "/getProscribedPersonsList")
  }
  //getProscribedOrganizationsList
  getProscribedOrganizationsList() {
    //  return this.httpRepository.getDatas(this.URL1)
    return this.httpRepository.getData(this.URL + "/getProscribedOrganizationsList")
  }

  //getCustomers
  getCustomers(customer_Name: any) {
    return this.httpRepository.getData(this.URL + "/getCustomers?customer_Name=" + customer_Name + "")
  }
    //getParentCustomer
    getParentCustomer() {
      return this.httpRepository.getData(this.URL + "/getParentCustomer")
  }

  //getRefCustomers
  getRefCustomers(customer_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getRefCustomers?customer_ID=" + customer_ID + "")
  }
  //saveCustomer
  saveCustomer(customer: any): Promise<any> {
    let body = JSON.stringify(customer);
    // alert(body);
    return this.httpRepository.create(this.URL, customer)
      .toPromise()
      .then(res => res.json() as Customers)
      .catch()
  }
  //updateCustomer
  updateCustomer(customer: any): Promise<any> {
    let body = JSON.stringify(customer);
    // alert(body);
    return this.httpRepository.update(this.URL, customer)
      .toPromise()
      .then(res => res.json() as Customers)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(customer_ID: Number): Observable<Customers> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?customer_ID=" + customer_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //IfExists
  IfExists(customer_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?customer_ID=" + customer_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //contactCellExists
  contactCellExists(number: any) {
    return this.httpRepository.getData(this.URL + "/contactCellExists?number=" + number + "")
  }
  customerCodeExists(code: any)
  {
    return this.httpRepository.getData(this.URL + "/customerCodeExists?code=" + code + "")
  }
  //emailExists
  emailExists(email: any) {
    return this.httpRepository.getData(this.URL + "/emailExists?email=" + email + "")
  }
  //getAddressByID
  getAddressByID(customer_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressByID?customer_ID=" + customer_ID)
  }
  /////////////////////////
  //getCategory
  getCategories() {
    return this.httpRepository.getData(this.URL + "/getCategories")
  }
  //getDiscountRates
  getDiscountRates() {
    return this.httpRepository.getData(this.URL + "/getDiscountRates")
  }
  //getArea
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
