import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { saleInvoice } from '../../../../../shared';


@Injectable()
export class CustomerReceiptImportService {

  url = 'api/CustomerPaymentImport';

  constructor(private httpRepository: RepositoryHttpService) { }

  //getArea
  getArea() {
    return this.httpRepository.getData(this.url + "/getArea")
  }

  //getPendingSalePayment
  getPendingSalePayment(AreaID: any, PaymentDate: any, userCurrentOffice: any) {
    return this.httpRepository.getData(this.url + "/getPendingSalePayment?AreaID=" + AreaID + "&PaymentDate=" + PaymentDate + "&userCurrentOffice=" + userCurrentOffice + "")
  }

  //getPendingSalePaymentDetail
  getPendingSalePaymentDetail(customer_ID: any, sale_Payment_ID: any, userCurrentOffice:any) {
    return this.httpRepository.getData(this.url + "/getPendingSalePaymentDetail?customer_ID=" + customer_ID + "&sale_Payment_ID=" + sale_Payment_ID + "&userCurrentOffice=" + userCurrentOffice + "")
  }

  //saveInvoice
  saveInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
    //  alert(body);
    return this.httpRepository.create(this.url, invoice)
      .toPromise()
      .then(res => res.json() as saleInvoice)
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


