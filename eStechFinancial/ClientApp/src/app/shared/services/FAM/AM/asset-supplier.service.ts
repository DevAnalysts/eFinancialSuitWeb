
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Suppliers } from '../../../../shared';

@Injectable()
export class AssetSupplierService {

  URL = 'api/AssetSupplier';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getSuppliers
  getSuppliers(Query:any) {
    return this.httpRepository.getData(this.URL + "/getSuppliers?Query=" + Query + "")
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
  ////getDetailsByID
  //getDetailsByID(ID: Number): Observable<Suppliers> {
  //  return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "")
  //    .map((res) => {
  //      return res.json()[0];
  //    })
  //    .catch(this.handleError);
  //}
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }
  //getAddressByID
  getAddressByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressByID?ID=" + ID)
  }
  //getCity
  getCity() {
    return this.httpRepository.getData(this.URL + "/getCity")
  }
  //getDistrict
  getRegion(ID: any) {
    return this.httpRepository.getData(this.URL + "/getRegion?ID=" + ID)
  }
  //getProvince
  getProvince(ID: any) {
    return this.httpRepository.getData(this.URL + "/getProvince?ID=" + ID)
  }
  //getCountry
  getCountry(ID: any) {
    return this.httpRepository.getData(this.URL + "/getCountry?ID=" + ID)
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
