import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Items } from '../../../../../shared';

@Injectable()
export class ItemRegistrationService {

  URL = 'api/ItemRegistration';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
   constructor(private httpRepository: RepositoryHttpService) { }

  //getItems
  getItems(ID: any, userCurrentOffice:any,userCurrentWarehouse:any) {
    return this.httpRepository.getData(this.URL + "/getItems?ID=" + ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getCategories
  getCategories() {
    return this.httpRepository.getData(this.URL + "/getCategories")
  }
  //
  isEnable(value: any)
  {
    return this.httpRepository.getData(this.URL + "/isEnable?value=" + value + "")
  }

  //getSubCategories
  getSubCategories(category_Code: any) {
    return this.httpRepository.getData(this.URL + "/getSubCategories?category_Code=" + category_Code + "")
  }

  //getUoM
  getUoM() {
    return this.httpRepository.getData(this.URL + "/getUoM")
  }
  //getMeasurementType
  getMeasurementType(UoMID: any) {
    return this.httpRepository.getData(this.URL + "/getMeasurementType?UoMID=" + UoMID + "")
  }
  //getBrands
  getBrands() {
    return this.httpRepository.getData(this.URL + "/getBrands")
  }
    //getModals
    getModals(BrandId : any) {
      return this.httpRepository.getData(this.URL + "/getModels?BrandId=" + BrandId + "")
    }

  //getpackingTypies
  getpackingTypies(UoMID: any) {
    return this.httpRepository.getData(this.URL + "/getpackingTypies?UoMID=" + UoMID + "")
  }
  //getTaxTypes
  getTaxTypes() {
    return this.httpRepository.getData(this.URL + "/getTaxTypes")
  }
  //getPriceList
  getPriceList(item_Code: any, mode: any) {
    return this.httpRepository.getData(this.URL + "/getPriceList?item_Code=" + item_Code + "&mode=" + mode + "")
  }
  //getParentList
  getParentList(parentitemcode: any, mode: any) {
      return this.httpRepository.getData(this.URL + "/getParentList?parentitemcode=" + parentitemcode + "&mode=" + mode + "")
  }
  //getParentItem
  getParentItem() {
      return this.httpRepository.getData(this.URL + "/getParentItem")
  }
  //getImageByID
  getImageByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getImageByID?ID=" + ID + "")
  }
  //getSupplier
  getSupplier() {
    return this.httpRepository.getData(this.URL + "/getSupplier")
  }
  //IfExists
  IfExists(item_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?item_ID=" + item_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //saveItem
  saveItem(item: any): Promise<any> {
    let body = JSON.stringify(item);
    //alert(body);
   return this.httpRepository.create(this.URL, item )
      .toPromise()
      .then(res => res.json() as Items)
      .catch()
  }
  //updateItem
  updateItem(item: any): Promise<any> {
    let body = JSON.stringify(item);
    return this.httpRepository.update(this.URL, item )
      .toPromise()
      .then(res => res.json() as Items)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(item_Code: Number): Observable<Items> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?item_Code=" + item_Code + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
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
