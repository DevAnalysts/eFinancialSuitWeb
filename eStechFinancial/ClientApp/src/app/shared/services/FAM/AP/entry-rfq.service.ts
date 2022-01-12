import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { SupplierQuotation} from '../../../../shared';


@Injectable()
export class EntryRFQService {

  orderurl = 'api/EntryRFQ';
  
  constructor(private httpRepository: RepositoryHttpService) { }
  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.orderurl + "/getGrid")
  }
  //searchGrid
  searchGrid(Query: any) {
    return this.httpRepository.getData(this.orderurl + "/searchOrderDetails?Query=" + Query + "")
  }
  //getRFQ
  getRFQ(ID: any) {
    return this.httpRepository.getData(this.orderurl + "/getRFQ?ID=" + ID + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(priviledged_Offices:any) {
    return this.httpRepository.getData(this.orderurl + "/getPriviledgedOffices?priviledged_Offices="+priviledged_Offices)
  }
  //getSuppliers
  getSuppliers() {
    return this.httpRepository.getData(this.orderurl + "/getSuppliers")
  }

  //getItems
  getItems(ID: any) {
    return this.httpRepository.getData(this.orderurl + "/getItems?ID=" + ID + "")
  }
  //////getUnitPrice
  ////getUnitPrice(item_ID: Number) {
  ////  return this.httpRepository.getData(this.orderurl + "/getUnitPrice?item_ID=" + item_ID + "")
  ////}
  //getPayments
  getPayments() {
    return this.httpRepository.getData(this.orderurl + "/getPayments")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.orderurl + "/guidExist?guid=" + guid + "")
  }
  //cancelOrder
  cancelOrder(ID: any, actionID: any) {
    return this.httpRepository.getData(this.orderurl + "/cancelOrder?ID=" + ID + "&actionID=" + actionID + "")
  }
  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    // alert(body);
     return this.httpRepository.create(this.orderurl, order )
      .toPromise()
      .then(res => res.json() as SupplierQuotation)
      .catch()
  }
  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    // alert(body);
    return this.httpRepository.update(this.orderurl, order )
      .toPromise()
      .then(res => res.json() as SupplierQuotation)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(ID: Number): Observable<SupplierQuotation> {
    return this.httpRepository.getData(this.orderurl + "/getDetailsByID?ID=" + ID+ "")
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

